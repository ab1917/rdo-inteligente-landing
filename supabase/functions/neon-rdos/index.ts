import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { neonQuery, neonExecute, neonUserError, type NeonResult } from '../_shared/neon-gateway.ts';
import { requestSchema, canWriteRDO, canApproveRDO } from './validation.ts';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const select = `select d.document, r.id, to_json(r.created_at) as created_iso, to_json(r.updated_at) as updated_iso
  from public.rdo_documents d join public.rdos r on r.id = d.rdo_id`;
const toRDO = (row: Record<string, unknown>) => ({ ...(row.document as Record<string, unknown>), id: row.id, createdAt: row.created_iso, updatedAt: row.updated_iso });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Não autenticado.' }, 401);
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_ANON_KEY');
    if (!url || !key) throw new Error('Auth configuration missing');
    const auth = createClient(url, key, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false, autoRefreshToken: false } });
    const { data: { user }, error } = await auth.auth.getUser();
    if (error || !user?.email) return json({ error: 'Sessão inválida.' }, 401);
    const found = await neonQuery('select id, company_id from public.users where email = $1 and status = $2 limit 1', [user.email, 'ativo']);
    const identity = found.rows[0];
    if (!identity?.company_id) return json({ error: 'Usuário sem empresa vinculada no Neon.' }, 403);
    const company = identity.company_id;
    if (req.method === 'GET') {
      const params = new URL(req.url).searchParams;
      const before = params.get('before');
      if (Array.from(params.keys()).some(k => k !== 'before') || (before && !/^\d{4}-\d{2}-\d{2}T.*Z\|[a-f0-9-]{36}$/.test(before))) return json({ error: 'Paginação inválida.' }, 400);
      const [timestamp, cursorId] = before?.split('|') ?? [];
      const result = await neonQuery(`${select} where d.company_id = $1 ${before ? 'and (r.created_at, r.id) < ($2::timestamptz, $3::uuid)' : ''} order by r.created_at desc, r.id desc limit 100`, before ? [company, timestamp, cursorId] : [company]);
      const last = result.rows[result.rows.length - 1];
      return json({ rdos: result.rows.map(toRDO), next: result.rows.length === 100 && last ? `${last.created_iso}|${last.id}` : null });
    }
    if (req.method !== 'POST') return json({ error: 'Método não suportado.' }, 405);
    if (Number(req.headers.get('content-length') || 0) > 12000000) return json({ error: 'RDO grande demais.' }, 413);
    const raw = await req.text();
    if (raw.length > 12000000) return json({ error: 'RDO grande demais.' }, 413);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return json({ error: 'Dados inválidos.' }, 400); }
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) return json({ error: 'Confira os campos do RDO.', details: parsed.error.flatten() }, 400);
    // Protected roles from the existing auth service, never from editable identity metadata or Neon users.role.
    const { data: roleRows, error: roleError } = await auth.from('user_roles').select('role').eq('user_id', user.id);
    if (roleError || !canWriteRDO((roleRows ?? []).map(r => r.role))) return json({ error: 'Sem permissão para alterar RDOs.' }, 403);
    const input = parsed.data;
    if (input.action === 'delete') {
      const removed = await neonExecute('delete from public.rdos r using public.rdo_documents d where r.id = d.rdo_id and d.company_id = $1 and r.id = $2 returning r.id', [company, input.id]);
      return removed.rows.length ? json({ ok: true }) : json({ error: 'RDO não encontrado.' }, 404);
    }
    if (input.rdo.status === 'aprovado' && !canApproveRDO((roleRows ?? []).map(r => r.role))) return json({ error: 'Sem permissão para aprovar RDOs.' }, 403);
    const rdo = input.rdo;
    if (input.action === 'create') {
      // Create the work only when the company has none with this name; work ownership is resolved via protected users.
      const result = await neonExecute<NeonResult>(`with existing_work as (
        select o.id from public.obras o join public.users u on u.id = o.responsavel_tecnico_id
        where u.company_id = $1 and o.nome = $2 limit 1
      ), new_work as (
        insert into public.obras (nome, cliente, endereco, responsavel_tecnico_id)
        select $2, $3, $4, $5::uuid where not exists (select 1 from existing_work) returning id
      ), inserted as (
        insert into public.rdos (id, obra_id, data, clima, temperatura, funcionarios_presentes, equipamentos_utilizados, atividades_executadas, materiais_utilizados, fotos, observacoes_gerais, status, criado_por_id)
        select $6::uuid, id, $7::date, $8, $9::int, $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb, $15, $16, $5::uuid from (select id from existing_work union all select id from new_work) w returning id
      ) insert into public.rdo_documents (rdo_id, company_id, document) select id, $1::uuid, $17::jsonb from inserted returning rdo_id`,
      [company, rdo.obra, rdo.cliente, rdo.local, identity.id, input.id, rdo.data, rdo.clima, rdo.temperatura, JSON.stringify(rdo.equipes), JSON.stringify(rdo.equipamentos ?? []), JSON.stringify(rdo.atividades), JSON.stringify(rdo.materiais ?? []), JSON.stringify(rdo.fotos), rdo.observacoes ?? '', rdo.status, JSON.stringify(rdo)]);
      if (!result.rows.length) throw new Error('RDO not inserted');
    } else {
      const result = await neonExecute(`with updated as (
        update public.rdos r set data = $3::date, clima = $4, temperatura = $5::int, funcionarios_presentes = $6::jsonb, equipamentos_utilizados = $7::jsonb, atividades_executadas = $8::jsonb, materiais_utilizados = $9::jsonb, fotos = $10::jsonb, observacoes_gerais = $11, status = $12, updated_at = now()
        from public.rdo_documents d where r.id = d.rdo_id and d.company_id = $1 and r.id = $2 returning r.id
      ) update public.rdo_documents d set document = $13::jsonb from updated where d.rdo_id = updated.id and d.company_id = $1 returning d.rdo_id`, [company, input.id, rdo.data, rdo.clima, rdo.temperatura, JSON.stringify(rdo.equipes), JSON.stringify(rdo.equipamentos ?? []), JSON.stringify(rdo.atividades), JSON.stringify(rdo.materiais ?? []), JSON.stringify(rdo.fotos), rdo.observacoes ?? '', rdo.status, JSON.stringify(rdo)]);
      if (!result.rows.length) return json({ error: 'RDO não encontrado.' }, 404);
    }
    const saved = await neonQuery(`${select} where d.company_id = $1 and r.id = $2 limit 1`, [company, input.id]);
    return json({ rdo: saved.rows[0] ? toRDO(saved.rows[0]) : null });
  } catch (err) {
    console.error(err);
    const { status, message } = neonUserError(err);
    return json({ error: message }, status);
  }
});