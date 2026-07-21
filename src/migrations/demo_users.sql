-- ============================================================
-- Script para recriar os 3 usuários de teste no Supabase
-- Execute este script no SQL Editor do Supabase (uma única vez)
-- Senha para todos os usuários: 123456
-- ============================================================

-- 1. Garantir que a empresa "Construtora Demo" existe
INSERT INTO public.companies (id, nome, cnpj, email, plano, status, data_expiracao, limites)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Construtora Demo Ltda',
  '12.345.678/0001-90',
  'contato@construtorademo.com.br',
  'professional',
  'ativa',
  CURRENT_DATE + INTERVAL '365 days',
  '{"obras": 100, "usuarios": 50, "armazenamento_gb": 100}'
)
ON CONFLICT (cnpj) DO UPDATE SET
  id = EXCLUDED.id,
  status = 'ativa';

-- 2. Função auxiliar para criar usuários no auth.users + public.users
CREATE OR REPLACE FUNCTION public.create_demo_user(
  p_user_id UUID,
  p_email TEXT,
  p_password TEXT,
  p_nome TEXT,
  p_role TEXT,
  p_company_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Inserir em auth.users (schema interno do Supabase Auth)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    p_user_id,
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('name', p_nome, 'role', p_role, 'company_id', p_company_id),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = NOW();

  -- Inserir identidade correspondente
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    p_user_id,
    p_user_id::text,
    jsonb_build_object('sub', p_user_id::text, 'email', p_email),
    'email',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (provider, provider_id) DO NOTHING;

  -- Inserir em public.users
  INSERT INTO public.users (id, company_id, nome, email, role, status)
  VALUES (p_user_id, p_company_id, p_nome, p_email, p_role, 'ativo')
  ON CONFLICT (id) DO UPDATE SET
    company_id = EXCLUDED.company_id,
    nome = EXCLUDED.nome,
    role = EXCLUDED.role,
    status = 'ativo';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar os 3 usuários demo
SELECT public.create_demo_user(
  '22222222-2222-2222-2222-222222222222',
  'admin@construtorademo.com.br',
  '123456',
  'Administrador Demo',
  'admin',
  '11111111-1111-1111-1111-111111111111'
);

SELECT public.create_demo_user(
  '33333333-3333-3333-3333-333333333333',
  'gestor@construtorademo.com.br',
  '123456',
  'Gestor Demo',
  'manager',
  '11111111-1111-1111-1111-111111111111'
);

SELECT public.create_demo_user(
  '44444444-4444-4444-4444-444444444444',
  'engenheiro@construtorademo.com.br',
  '123456',
  'Engenheiro Demo',
  'engineer',
  '11111111-1111-1111-1111-111111111111'
);

-- 4. Limpeza (remove a função auxiliar após uso)
DROP FUNCTION public.create_demo_user(UUID, TEXT, TEXT, TEXT, TEXT, UUID);

-- ============================================================
-- Credenciais criadas:
--   admin@construtorademo.com.br      / 123456  (role: admin)
--   gestor@construtorademo.com.br     / 123456  (role: manager)
--   engenheiro@construtorademo.com.br / 123456  (role: engineer)
-- Todos vinculados à empresa "Construtora Demo Ltda"
-- ============================================================
