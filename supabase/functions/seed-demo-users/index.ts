import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const DEMO_USERS = [
  { email: 'admin@construtorademo.com.br', name: 'Admin Demo', role: 'admin' },
  { email: 'gestor@construtorademo.com.br', name: 'Gestor Demo', role: 'manager' },
  { email: 'engenheiro@construtorademo.com.br', name: 'Engenheiro Demo', role: 'engineer' },
];
const DEMO_PASSWORD = '123456';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Create (or reuse) the demo company
    let companyId: string;
    const { data: existingCompany } = await admin
      .from('companies')
      .select('id')
      .eq('name', 'Construtora Demo Ltda')
      .maybeSingle();

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      const { data: company, error: companyError } = await admin
        .from('companies')
        .insert({ name: 'Construtora Demo Ltda', plan: 'professional', status: 'active' })
        .select('id')
        .single();
      if (companyError) throw companyError;
      companyId = company.id;
    }

    const results: { email: string; status: string }[] = [];

    for (const u of DEMO_USERS) {
      // Check if auth user already exists
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list?.users?.find((x) => x.email === u.email);

      let userId: string;
      if (existing) {
        userId = existing.id;
      } else {
        const { data: created, error: createError } = await admin.auth.admin.createUser({
          email: u.email,
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { name: u.name, role: u.role, company_id: companyId },
        });
        if (createError) throw createError;
        userId = created.user.id;
      }

      // Upsert application user record
      const { error: upsertError } = await admin.from('users').upsert({
        id: userId,
        email: u.email,
        name: u.name,
        company_id: companyId,
      });
      if (upsertError) throw upsertError;

      // Assign role in the protected roles table
      const { error: roleError } = await admin.from('user_roles').upsert(
        { user_id: userId, role: u.role },
        { onConflict: 'user_id,role' },
      );
      if (roleError) throw roleError;

      results.push({ email: u.email, status: existing ? 'already existed, profile synced' : 'created' });
    }

    return new Response(JSON.stringify({ ok: true, companyId, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
