import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { neonQuery, neonExecute, neonUserError } from '../_shared/neon-gateway.ts';
import { commercialIdentity, requireCommercialWrite, RequestError } from '../_shared/commercial-auth.ts';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/), money = z.number().finite().nonnegative(), id = z.string().uuid();
const schema = z.discriminatedUnion('action', [
 z.object({ action: z.literal('list'), before: id.nullable().optional() }),
 z.object({ action: z.literal('scope'), id, contract_id: id, inicio: date, fim: date, percentual: z.number().finite().positive().max(100), descricao: z.string().trim().min(3).max(10000) }),
 z.object({ action: z.literal('status'), id, status: z.enum(['aprovado','faturado']) }),
 z.object({ action: z.literal('hh'), bulletin: z.object({ id, rdo_id: z.string().min(1).max(10000), obra_nome: z.string().min(2).max(255), data: date, data_inicio: date, data_fim: date, funcionarios: z.array(z.object({ valor_total: money }).passthrough()).max(500), equipamentos: z.array(z.object({ valor_total: money }).passthrough()).max(500), materiais: z.array(z.object({ valor_total: money }).passthrough()).max(500), resumo_financeiro: z.object({ total_geral: money }).passthrough(), configuracao_medicao: z.record(z.unknown()), id_contrato: id.optional() }).passthrough() }),
]);
Deno.serve(async req => {
 if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
 try {
  const identity = await commercialIdentity(req);
  if (req.method !== 'POST' && req.method !== 'GET') return json({ error: 'Método não suportado.' }, 405);
  const parsed = schema.safeParse(req.method === 'GET' ? { action: 'list' } : await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'Confira os campos da medição.', details: parsed.error.flatten() }, 400);
  const input = parsed.data, company = identity.company;
  if (input.action === 'list') {
   const result = await neonQuery('select bulletin_id, document from public.bulletin_documents where company_id=$1 and ($2::uuid is null or bulletin_id<$2::uuid) order by bulletin_id desc limit 100', [company,input.before ?? null]);
   return json({ boletins: result.rows.map(r => r.document), next: result.rows.length === 100 ? result.rows.at(-1)?.bulletin_id : null });
  }
  requireCommercialWrite(identity.roles, input.action === 'status');
  if (input.action === 'scope') {
   if (input.inicio > input.fim) throw new RequestError('Período inválido.');
   const result = await neonExecute('select public.save_scope_bulletin($1,$2,$3,$4::date,$5::date,$6::numeric,$7,$8) as document', [company,input.contract_id,input.id,input.inicio,input.fim,input.percentual,input.descricao,identity.name]);
   return json({ boletim: result.rows[0]?.document });
  }
  if (input.action === 'status') {
   const result = await neonExecute('select public.transition_bulletin($1,$2,$3,$4) as document', [company,input.id,input.status,identity.name]);
   return json({ boletim: result.rows[0]?.document });
  }
  const b = input.bulletin;
  if (b.data_inicio > b.data_fim) throw new RequestError('Período inválido.');
  const ids = b.rdo_id.split(',').map(v => v.trim());
  if (!ids.length || ids.some(v => !id.safeParse(v).success) || new Set(ids).size !== ids.length) throw new RequestError('RDOs inválidos.');
  const owned = await neonQuery(`select r.obra_id, d.document from public.rdo_documents d join public.rdos r on r.id=d.rdo_id where d.company_id=$1 and d.rdo_id=any($2::uuid[]) limit 500`, [company,ids]);
  if (owned.rows.length !== ids.length || owned.rows.some(r => { const d=r.document as any; return d.obra!==b.obra_nome || d.data.slice(0,10)<b.data_inicio || d.data.slice(0,10)>b.data_fim; })) throw new RequestError('RDOs não pertencem à obra, período ou empresa.',403);
  if (b.id_contrato) {
   const contract = await neonQuery(`select document from public.commercial_documents where company_id=$1 and record_id=$2 and entity='contratos' limit 1`, [company,b.id_contrato]);
   const c=contract.rows[0]?.document as any;
   if (!c || c.nome_projeto!==b.obra_nome || c.status!=='ativo' || c.tipo_execucao==='escopo') throw new RequestError('Contrato incompatível com medição por HH.');
  }
  const sum = (items: {valor_total:number}[]) => Math.round(items.reduce((s,i)=>s+i.valor_total,0)*100)/100;
  const total_funcionarios=sum(b.funcionarios), total_equipamentos=sum(b.equipamentos), total_materiais=sum(b.materiais);
  const document = { ...b, tipo_medicao:'hh', status:'rascunho', criado_em:new Date().toISOString(), resumo_financeiro:{...b.resumo_financeiro,total_funcionarios,total_equipamentos,total_materiais,total_geral:Math.round((total_funcionarios+total_equipamentos+total_materiais)*100)/100} };
  const existing=await neonQuery('select document from public.bulletin_documents where company_id=$1 and bulletin_id=$2 limit 1',[company,b.id]);
  if(existing.rows.length) return json({boletim:existing.rows[0].document});
  const overlap=await neonQuery(`select bulletin_id from public.bulletin_documents where company_id=$1 and document->>'tipo_medicao'='hh' and string_to_array(document->>'rdo_id',',') && $2::text[] limit 1`,[company,ids]);
  if(overlap.rows.length) throw new RequestError('Um dos RDOs já está incluído em outra medição.',409);
  const inserted=await neonExecute<{results:{rows:unknown[]}[]}>([
   {query:'insert into public.boletins_medicao (id,obra_id,periodo_inicio,periodo_fim,responsavel_medicao,valor_total_periodo,status) values ($1,$2,$3::date,$4::date,$5,$6,$7) returning id',params:[b.id,owned.rows[0].obra_id,b.data_inicio,b.data_fim,identity.name,document.resumo_financeiro.total_geral,'rascunho']},
   {query:'insert into public.bulletin_documents (bulletin_id,company_id,contract_id,document) values ($1,$2,$3,$4::jsonb) returning bulletin_id',params:[b.id,company,b.id_contrato ?? null,JSON.stringify(document)]}
  ]);
  if(!inserted.results[1]?.rows.length) throw new Error('Bulletin not saved');
  return json({boletim:document});
 } catch(err) { console.error(err); const failure=err instanceof RequestError?{status:err.status,message:err.message}:neonUserError(err); return json({error:failure.message},failure.status); }
});
