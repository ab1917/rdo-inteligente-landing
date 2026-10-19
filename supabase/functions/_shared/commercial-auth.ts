import { createClient } from 'npm:@supabase/supabase-js@2';
import { neonQuery } from './neon-gateway.ts';
export class RequestError extends Error { constructor(message: string, public status = 400) { super(message); } }
export async function commercialIdentity(req: Request) {
  const header = req.headers.get('Authorization');
  if (!header) throw new RequestError('Não autenticado.', 401);
  const url = Deno.env.get('SUPABASE_URL'), key = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !key) throw new Error('Auth configuration missing');
  const auth = createClient(url, key, { global: { headers: { Authorization: header } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await auth.auth.getUser();
  if (error || !user?.email) throw new RequestError('Sessão inválida.', 401);
  const identity = await neonQuery('select id, company_id, name from public.users where email = $1 and status = $2 limit 1', [user.email, 'ativo']);
  const row = identity.rows[0];
  if (!row?.company_id) throw new RequestError('Usuário sem empresa vinculada no Neon.', 403);
  const { data: roles, error: roleError } = await auth.from('user_roles').select('role').eq('user_id', user.id);
  if (roleError) throw new RequestError('Não foi possível verificar suas permissões.', 403);
  return { company: String(row.company_id), userId: user.id, name: String(row.name || user.email), roles: (roles ?? []).map(r => String(r.role)) };
}
export function requireCommercialWrite(roles: string[], approval = false) {
  const allowed = approval ? ['admin', 'manager', 'super_admin'] : ['admin', 'manager', 'engineer', 'super_admin'];
  if (!roles.some(role => allowed.includes(role))) throw new RequestError('Sem permissão para esta operação.', 403);
}
