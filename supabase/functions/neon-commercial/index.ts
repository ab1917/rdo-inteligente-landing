import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { neonQuery, neonExecute, neonUserError } from '../_shared/neon-gateway.ts';
import { commercialIdentity, requireCommercialWrite, RequestError } from '../_shared/commercial-auth.ts';
import { requestSchema, schemas } from './validation.ts';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
Deno.serve(async req => {
 if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
 try {
  const identity = await commercialIdentity(req);
  if (req.method !== 'POST' && req.method !== 'GET') return json({ error: 'Método não suportado.' }, 405);
  const parsed = requestSchema.safeParse(req.method === 'GET' ? { action: 'list' } : await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'Dados inválidos.' }, 400);
  const input = parsed.data, company = identity.company;
  if (input.action === 'list') {
   const result = await neonQuery('select record_id, entity, document from public.commercial_documents where company_id = $1 and ($2::uuid is null or record_id < $2::uuid) order by record_id desc limit 100', [company, input.before ?? null]);
   return json({ records: result.rows, next: result.rows.length === 100 ? result.rows.at(-1)?.record_id : null });
  }
  requireCommercialWrite(identity.roles);
  const documentParsed = schemas[input.entity].safeParse(input.document);
  if (!documentParsed.success) return json({ error: 'Confira os campos do registro.', details: documentParsed.error.flatten() }, 400);
  const doc = { ...documentParsed.data, id: input.id } as Record<string, any>;
  if ((input.entity === 'orcamentos' && doc.status === 'aprovado') || input.entity === 'contratos') requireCommercialWrite(identity.roles, true);
  const existing = await neonQuery('select document from public.commercial_documents where entity = $1 and record_id = $2 and company_id = $3 limit 1', [input.entity, input.id, company]);
  if (existing.rows.length && ['contratos','orcamentos'].includes(input.entity)) {
   const old = existing.rows[0].document as Record<string, any>;
   if (input.entity === 'orcamentos' && old.virou_contrato && JSON.stringify(old) !== JSON.stringify(doc)) throw new RequestError('Orçamento já convertido em contrato não pode ser alterado.', 409);
   if (input.entity === 'contratos') {
    const measured = await neonQuery('select bulletin_id from public.bulletin_documents where company_id = $1 and contract_id = $2 limit 1', [company, input.id]);
    if (measured.rows.length) throw new RequestError('Contrato com medições não pode ser alterado.', 409);
   }
  }
  for (const [field, entity] of [['id_cliente','clientes'],['id_lead','leads'],['id_oportunidade','oportunidades'],['id_orcamento','orcamentos']] as const) {
   if (!doc[field]) continue;
   const related = await neonQuery('select document from public.commercial_documents where company_id = $1 and entity = $2 and record_id = $3 limit 1', [company, entity, doc[field]]);
   if (!related.rows.length) throw new RequestError('Registro relacionado não pertence à sua empresa.', 403);
   if (input.entity === 'contratos' && field === 'id_orcamento') {
    const budget = related.rows[0].document as Record<string, any>;
    if (budget.status !== 'aprovado' || budget.virou_contrato) throw new RequestError('Selecione um orçamento aprovado ainda sem contrato.', 409);
    doc.valor_fechado = Number(budget.valor_total); doc.nome_projeto = budget.nome_projeto; doc.nome_cliente = budget.nome_cliente; doc.id_cliente = budget.id_cliente;
   }
  }
  const params = [company, input.id, JSON.stringify(doc)];
  const writes: { query: string; params: unknown[] }[] = [];
  // Fixed table/column names only. Every value stays parameterized.
  switch (input.entity) {
   case 'leads': writes.push({ query: `insert into public.leads (id,nome_contato,empresa,email,telefone,fonte,interesse,valor_estimado,status,data_criacao,ultima_interacao,observacoes) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::date,$11::date,$12) on conflict (id) do update set nome_contato=excluded.nome_contato,empresa=excluded.empresa,email=excluded.email,telefone=excluded.telefone,valor_estimado=excluded.valor_estimado,status=excluded.status,observacoes=excluded.observacoes,updated_at=now() where exists (select 1 from public.commercial_documents where company_id=$13 and record_id=$1) returning id`, params: [input.id,doc.nome_cliente,doc.empresa ?? '',doc.email,doc.telefone,doc.origem,doc.tipo_servico,doc.valor_estimado ?? 0,doc.status,doc.data_criacao,doc.data_contato,doc.observacoes ?? '',company] }); break;
   case 'clientes': writes.push({ query: `insert into public.clientes (id,nome,tipo,cpf_cnpj,email,telefone,endereco,cidade,estado,cep,status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) on conflict (id) do update set nome=excluded.nome,email=excluded.email,telefone=excluded.telefone,endereco=excluded.endereco,status=excluded.status,updated_at=now() where exists (select 1 from public.commercial_documents where company_id=$12 and record_id=$1) returning id`, params: [input.id,doc.nome,doc.tipo,doc.cpf_cnpj,doc.email,doc.telefone,doc.endereco,doc.cidade,doc.estado,doc.cep,doc.status,company] }); break;
   case 'oportunidades': writes.push({ query: `insert into public.oportunidades (id,id_lead,id_cliente,nome_projeto,descricao,valor_estimado,probabilidade,estagio,status,data_fechamento_prevista,responsavel_comercial,historico_acoes) values ($1,$2::uuid,$3::uuid,$4,$5,$6,$7,$8,$8,$9::date,$10,$11::jsonb) on conflict (id) do update set descricao=excluded.descricao,valor_estimado=excluded.valor_estimado,probabilidade=excluded.probabilidade,estagio=excluded.estagio,status=excluded.status,historico_acoes=excluded.historico_acoes,updated_at=now() where exists (select 1 from public.commercial_documents where company_id=$12 and record_id=$1) returning id`, params: [input.id,doc.id_lead || null,doc.id_cliente || null,doc.nome_projeto || doc.descricao_escopo,doc.descricao_escopo,doc.valor_estimado,doc.probabilidade_fechamento,doc.status,doc.data_prevista_fechamento,doc.responsavel_comercial,JSON.stringify(doc.historico_acoes),company] }); break;
   case 'orcamentos': writes.push({ query: `insert into public.orcamentos (id,id_oportunidade,id_cliente,nome_cliente,nome_projeto,endereco_execucao,valor_total,hh_previsto_total,margem_lucro_prevista,status,condicoes_pagamento,prazo_execucao_dias) values ($1,$2::uuid,$3::uuid,$4,$5,$6,$7,$8,$9,$10,$11,$12) on conflict (id) do update set valor_total=excluded.valor_total,status=excluded.status,condicoes_pagamento=excluded.condicoes_pagamento,updated_at=now() where exists (select 1 from public.commercial_documents where company_id=$13 and record_id=$1) returning id`, params: [input.id,doc.id_oportunidade || null,doc.id_cliente || null,doc.nome_cliente,doc.nome_projeto,doc.endereco_execucao,doc.valor_total,doc.hh_previsto_total,doc.margem_lucro_prevista,doc.status,doc.forma_pagamento,doc.prazo_execucao_dias,company] }); break;
   case 'contratos': writes.push({ query: `insert into public.contracts (id,name,status,metadata) values ($1,$2,$3,$4::jsonb) on conflict (id) do update set name=excluded.name,status=excluded.status,metadata=excluded.metadata,updated_at=now() where exists (select 1 from public.commercial_documents where company_id=$5 and record_id=$1) returning id`, params: [input.id,doc.nome_projeto,doc.status,JSON.stringify(doc),company] }); break;
  }
  writes.push({ query: `insert into public.commercial_documents (company_id,record_id,entity,document) values ($1,$2,$4,$3::jsonb) on conflict (record_id) do update set document=excluded.document,updated_at=now() where commercial_documents.company_id=excluded.company_id and commercial_documents.entity=excluded.entity returning record_id`, params: [...params,input.entity] });
  if (input.entity === 'oportunidades' && doc.id_lead) writes.push({ query: `with updated as (update public.leads set convertido_oportunidade=true,id_oportunidade=$2 where id=$3 and exists(select 1 from public.commercial_documents where company_id=$1 and record_id=$3) returning id) update public.commercial_documents set document=document || jsonb_build_object('convertido_oportunidade',true,'id_oportunidade',$2::text) where company_id=$1 and entity='leads' and record_id in(select id from updated)`, params: [company,input.id,doc.id_lead] });
  if (input.entity === 'orcamentos' && doc.id_oportunidade) writes.push({ query: `update public.commercial_documents set document=document || jsonb_build_object('tem_orcamento',true,'id_orcamento',$2::text) where company_id=$1 and entity='oportunidades' and record_id=$3`, params: [company,input.id,doc.id_oportunidade] });
  if (input.entity === 'contratos' && doc.id_orcamento) writes.push({ query: `update public.commercial_documents set document=document || jsonb_build_object('virou_contrato',true,'id_contrato',$2::text) where company_id=$1 and entity='orcamentos' and record_id=$3`, params: [company,input.id,doc.id_orcamento] });
  const result = await neonExecute<{ results: { rows: unknown[] }[] }>(writes);
  if (!result.results[0]?.rows.length || !result.results[1]?.rows.length) throw new RequestError('Registro indisponível para esta empresa.', 409);
  return json({ document: doc });
 } catch (err) { console.error(err); const failure = err instanceof RequestError ? { status: err.status, message: err.message } : neonUserError(err); return json({ error: failure.message }, failure.status); }
});
