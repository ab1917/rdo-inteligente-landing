import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

import { neonQuery, neonExecute, neonUserError } from '../_shared/neon-gateway.ts';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Authenticate the caller against Lovable Cloud Auth.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Não autenticado.' }, 401);
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !anonKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.email) return json({ error: 'Sessão inválida.' }, 401);

    // Resolve the company from protected application records, never from client input.
    const found = await neonQuery(
      'select company_id from public.users where email = $1 and status <> $2 limit 1',
      [user.email, 'inativo'],
    );
    const companyId = found.rows[0]?.company_id as string | undefined;
    if (!companyId) return json({ error: 'Usuário sem empresa vinculada no banco de dados.' }, 403);

    if (req.method === 'GET') {
      const result = await neonQuery(
        'select config, to_json(updated_at) as updated_at_iso from public.measurement_settings where company_id = $1',
        [companyId],
      );
      return json({ config: result.rows[0]?.config ?? null, updated_at: result.rows[0]?.updated_at_iso ?? null });
    }

    if (req.method === 'PUT') {
      const body = await req.json().catch(() => null);
      if (!body || typeof body.config !== 'object' || body.config === null || Array.isArray(body.config)) {
        return json({ error: 'Configuração inválida.' }, 400);
      }
      const configText = JSON.stringify(body.config);
      if (configText.length > 200_000) return json({ error: 'Configuração grande demais.' }, 413);
      await neonExecute(
        `insert into public.measurement_settings (company_id, config, updated_at) values ($1, $2::jsonb, now())
         on conflict (company_id) do update set config = excluded.config, updated_at = now()`,
        [companyId, configText],
      );
      return json({ ok: true });
    }

    return json({ error: 'Método não suportado.' }, 405);
  } catch (err) {
    console.error(err);
    const { status, message } = neonUserError(err);
    return json({ error: message }, status);
  }
});
