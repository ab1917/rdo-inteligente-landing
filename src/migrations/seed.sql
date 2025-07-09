-- Migração inicial: Criação das tabelas principais
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Empresas/Construtoras (multi-tenant)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  plano VARCHAR(20) DEFAULT 'starter' CHECK (plano IN ('starter', 'professional', 'enterprise')),
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'suspensa', 'cancelada', 'trial')),
  data_criacao DATE DEFAULT CURRENT_DATE,
  data_expiracao DATE,
  configuracoes JSONB DEFAULT '{}',
  limites JSONB DEFAULT '{"obras": 3, "usuarios": 10, "armazenamento_gb": 10}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usuários do sistema (integração com Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'manager', 'engineer', 'viewer')),
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pendente')),
  configuracoes JSONB DEFAULT '{}',
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assinaturas e histórico de planos
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  plano VARCHAR(20) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'cancelada', 'suspensa', 'trial')),
  data_inicio DATE NOT NULL,
  data_fim DATE,
  gateway_pagamento VARCHAR(50),
  external_id VARCHAR(255),
  metadados JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurações globais do sistema
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50),
  criado_por UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funcionários (agora com company_id)
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  salario DECIMAL(10,2) NOT NULL,
  data_admissao DATE NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco TEXT,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias', 'afastado')),
  especialidades TEXT[] DEFAULT '{}',
  certificacoes JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, cpf),
  UNIQUE(company_id, email)
);

-- Equipes
CREATE TABLE IF NOT EXISTS equipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  lider_id UUID REFERENCES funcionarios(id),
  descricao TEXT,
  area VARCHAR(100),
  funcionario_ids UUID[] DEFAULT '{}',
  projetos_ativos UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipamentos
CREATE TABLE IF NOT EXISTS equipamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  marca VARCHAR(100),
  modelo VARCHAR(100),
  numero_serie VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_uso', 'manutencao', 'inativo')),
  localizacao VARCHAR(255),
  responsavel_id UUID REFERENCES funcionarios(id),
  valor_aquisicao DECIMAL(12,2),
  data_aquisicao DATE,
  data_ultima_manutencao DATE,
  proxima_manutencao DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Obras
CREATE TABLE IF NOT EXISTS obras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  endereco TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim_prevista DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'em_andamento', 'pausada', 'concluida', 'cancelada')),
  valor_contrato DECIMAL(15,2),
  percentual_execucao DECIMAL(5,2) DEFAULT 0,
  responsavel_tecnico_id UUID REFERENCES funcionarios(id),
  equipe_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RDOs
CREATE TABLE IF NOT EXISTS rdos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) NOT NULL,
  data DATE NOT NULL,
  clima VARCHAR(20) CHECK (clima IN ('sol', 'chuva', 'nublado', 'garoa')),
  temperatura INTEGER,
  funcionarios_presentes JSONB DEFAULT '[]',
  equipamentos_utilizados JSONB DEFAULT '[]',
  atividades_executadas JSONB DEFAULT '[]',
  materiais_utilizados JSONB DEFAULT '[]',
  fotos JSONB DEFAULT '[]',
  observacoes_gerais TEXT,
  problemas_encontrados TEXT[],
  status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'rejeitado')),
  criado_por_id UUID REFERENCES funcionarios(id) NOT NULL,
  aprovado_por_id UUID REFERENCES funcionarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('pessoa_fisica', 'pessoa_juridica')),
  cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'prospect')),
  data_cadastro DATE DEFAULT CURRENT_DATE,
  responsavel_comercial_id UUID REFERENCES funcionarios(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_contato VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(20),
  fonte VARCHAR(100),
  interesse VARCHAR(255),
  valor_estimado DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'descartado', 'convertido')),
  data_criacao DATE DEFAULT CURRENT_DATE,
  ultima_interacao DATE,
  responsavel_id UUID REFERENCES funcionarios(id),
  observacoes TEXT,
  convertido_oportunidade BOOLEAN DEFAULT FALSE,
  id_oportunidade UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Oportunidades
CREATE TABLE IF NOT EXISTS oportunidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_lead UUID REFERENCES leads(id),
  id_cliente UUID REFERENCES clientes(id) NOT NULL,
  nome_projeto VARCHAR(255) NOT NULL,
  descricao TEXT,
  valor_estimado DECIMAL(12,2),
  probabilidade INTEGER DEFAULT 50 CHECK (probabilidade >= 0 AND probabilidade <= 100),
  estagio VARCHAR(20) DEFAULT 'qualificacao' CHECK (estagio IN ('qualificacao', 'proposta', 'negociacao', 'fechamento')),
  data_criacao DATE DEFAULT CURRENT_DATE,
  data_fechamento_prevista DATE,
  responsavel_comercial VARCHAR(255),
  tipo_projeto VARCHAR(100),
  prazo_execucao_estimado INTEGER,
  requisitos_tecnicos TEXT,
  concorrentes TEXT[],
  historico_acoes JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'ganha', 'perdida', 'pausada')),
  motivo_perda TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orçamentos
CREATE TABLE IF NOT EXISTS orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_oportunidade UUID REFERENCES oportunidades(id) NOT NULL,
  id_cliente UUID REFERENCES clientes(id) NOT NULL,
  nome_cliente VARCHAR(255) NOT NULL,
  nome_projeto VARCHAR(255) NOT NULL,
  endereco_execucao TEXT,
  data_criacao DATE DEFAULT CURRENT_DATE,
  validade_dias INTEGER DEFAULT 30,
  prazo_execucao_dias INTEGER,
  responsavel_comercial VARCHAR(255),
  responsavel_tecnico VARCHAR(255),
  escopo_servicos TEXT,
  hh_previsto_total DECIMAL(10,2),
  custo_mao_obra DECIMAL(12,2),
  custo_materiais DECIMAL(12,2),
  custo_equipamentos DECIMAL(12,2),
  custo_terceiros DECIMAL(12,2),
  custos_indiretos DECIMAL(12,2),
  valor_total DECIMAL(15,2),
  margem_lucro_prevista DECIMAL(5,2),
  condicoes_pagamento TEXT,
  observacoes_tecnicas TEXT,
  status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'rejeitado')),
  aprovado_comercial BOOLEAN DEFAULT FALSE,
  aprovado_tecnico BOOLEAN DEFAULT FALSE,
  data_aprovacao DATE,
  virou_contrato BOOLEAN DEFAULT FALSE,
  id_contrato UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contratos
CREATE TABLE IF NOT EXISTS contratos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_orcamento UUID REFERENCES orcamentos(id) NOT NULL,
  id_cliente UUID REFERENCES clientes(id) NOT NULL,
  nome_cliente VARCHAR(255) NOT NULL,
  nome_projeto VARCHAR(255) NOT NULL,
  endereco_execucao TEXT,
  data_assinatura DATE DEFAULT CURRENT_DATE,
  prazo_execucao INTEGER,
  valor_fechado DECIMAL(15,2),
  tipo_execucao VARCHAR(20) DEFAULT 'escopo' CHECK (tipo_execucao IN ('escopo', 'administracao')),
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido', 'cancelado')),
  hh_executado_total DECIMAL(10,2) DEFAULT 0,
  custo_executado_total DECIMAL(15,2) DEFAULT 0,
  margem_real_atual DECIMAL(5,2),
  percentual_execucao DECIMAL(5,2) DEFAULT 0,
  valor_faturado_total DECIMAL(15,2) DEFAULT 0,
  valor_pendente_faturamento DECIMAL(15,2) DEFAULT 0,
  status_financeiro VARCHAR(20) DEFAULT 'em_dia' CHECK (status_financeiro IN ('em_dia', 'atraso', 'inadimplencia')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boletins de Medição
CREATE TABLE IF NOT EXISTS boletins_medicao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obra_id UUID REFERENCES obras(id) NOT NULL,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  responsavel_medicao VARCHAR(255),
  responsavel_aprovacao VARCHAR(255),
  data_medicao DATE DEFAULT CURRENT_DATE,
  data_aprovacao DATE,
  servicos_executados JSONB DEFAULT '[]',
  valor_total_periodo DECIMAL(12,2),
  valor_acumulado DECIMAL(12,2),
  percentual_fisico_periodo DECIMAL(5,2),
  percentual_fisico_acumulado DECIMAL(5,2),
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'rejeitado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projetos (Cronograma)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  cliente VARCHAR(255),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'em_andamento', 'pausado', 'concluido', 'cancelado')),
  valor_orcado DECIMAL(15,2),
  gerente_projeto_id UUID REFERENCES funcionarios(id),
  equipe_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atividades (Cronograma)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  duracao_dias INTEGER,
  dependencias TEXT[],
  responsavel_id UUID REFERENCES funcionarios(id),
  status VARCHAR(20) DEFAULT 'nao_iniciada' CHECK (status IN ('nao_iniciada', 'em_andamento', 'concluida', 'atrasada')),
  percentual_conclusao DECIMAL(5,2) DEFAULT 0,
  predecessor_ids UUID[] DEFAULT '{}',
  sucessor_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_funcionarios_status ON funcionarios(status);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cargo ON funcionarios(cargo);
CREATE INDEX IF NOT EXISTS idx_rdos_obra_data ON rdos(obra_id, data);
CREATE INDEX IF NOT EXISTS idx_rdos_status ON rdos(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_oportunidades_estagio ON oportunidades(estagio);
CREATE INDEX IF NOT EXISTS idx_contratos_status ON contratos(status);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name != 'schema_migrations'
  LOOP
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END;
$$;

-- Habilitar Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletins_medicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para multi-tenant
-- Companies: usuários só veem sua própria empresa (exceto super_admin)
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE company_id = companies.id
    ) OR
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'super_admin'
    )
  );

-- Users: usuários veem apenas colegas da mesma empresa
CREATE POLICY "Users can view company users" ON users
  FOR SELECT USING (
    company_id = (
      SELECT company_id FROM users WHERE id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'super_admin'
    )
  );

-- Funcionários: isolamento por empresa
CREATE POLICY "Company data isolation" ON funcionarios
  FOR ALL USING (
    company_id = (
      SELECT company_id FROM users WHERE id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'super_admin'
    )
  );

-- Aplicar mesma política para todas as tabelas principais
CREATE POLICY "Company data isolation" ON equipes
  FOR ALL USING (
    id IN (
      SELECT e.id FROM equipes e
      JOIN funcionarios f ON f.id = e.lider_id
      WHERE f.company_id = (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    ) OR
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'super_admin'
    )
  );

-- Inserir dados iniciais

-- Super Admin inicial
INSERT INTO companies (id, nome, cnpj, email, plano, status, limites) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Super Admin', '00.000.000/0000-00', 'superadmin@sistema.com', 'enterprise', 'ativa', '{}')
ON CONFLICT (id) DO NOTHING;

-- Empresa demo para testes
INSERT INTO companies (nome, cnpj, email, plano, status, data_expiracao, limites) VALUES
  ('Construtora Demo Ltda', '12.345.678/0001-90', 'contato@construtorademo.com', 'professional', 'trial', CURRENT_DATE + INTERVAL '30 days', '{"obras": 100, "usuarios": 50, "armazenamento_gb": 100}')
ON CONFLICT (cnpj) DO NOTHING;

-- Configurações globais do sistema
INSERT INTO system_settings (chave, valor, descricao, categoria) VALUES
  ('planos_config', '{
    "starter": {"preco": 297, "obras": 3, "usuarios": 10, "armazenamento_gb": 10},
    "professional": {"preco": 597, "obras": -1, "usuarios": 50, "armazenamento_gb": 100},
    "enterprise": {"preco": 1297, "obras": -1, "usuarios": -1, "armazenamento_gb": -1}
  }', 'Configuração dos planos e limites', 'planos'),
  ('sistema_config', '{
    "manutencao": false,
    "versao": "1.0.0",
    "notificacoes_ativas": true
  }', 'Configurações gerais do sistema', 'sistema')
ON CONFLICT (chave) DO NOTHING;

-- Comentários nas tabelas
COMMENT ON TABLE companies IS 'Empresas/Construtoras do sistema';
COMMENT ON TABLE users IS 'Usuários do sistema integrados com Supabase Auth';
COMMENT ON TABLE subscriptions IS 'Histórico de assinaturas e planos';
COMMENT ON TABLE system_settings IS 'Configurações globais do sistema';
COMMENT ON TABLE funcionarios IS 'Cadastro de funcionários da empresa';
COMMENT ON TABLE equipes IS 'Equipes de trabalho e suas composições';
COMMENT ON TABLE equipamentos IS 'Inventário de equipamentos da empresa';
COMMENT ON TABLE obras IS 'Projetos e obras em execução';
COMMENT ON TABLE rdos IS 'Relatórios Diários de Obra';
COMMENT ON TABLE leads IS 'Leads comerciais';
COMMENT ON TABLE clientes IS 'Base de clientes';
COMMENT ON TABLE oportunidades IS 'Pipeline comercial - oportunidades';
COMMENT ON TABLE orcamentos IS 'Orçamentos elaborados';
COMMENT ON TABLE contratos IS 'Contratos firmados';
COMMENT ON TABLE boletins_medicao IS 'Medições físico-financeiras das obras';
COMMENT ON TABLE projects IS 'Projetos para controle de cronograma';
COMMENT ON TABLE activities IS 'Atividades dos projetos';