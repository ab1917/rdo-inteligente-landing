export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer' | 'manager';
  company: string;
  avatar?: string;
}

export interface RDO {
  id: string;
  // Identificação expandida
  tipo: 'obra_civil' | 'manutencao_industrial';
  obra: string;
  cliente: string;
  local: string;
  setor?: string; // Para indústria
  ativo?: string; // Equipamento/linha de produção
  os_numero?: string; // Ordem de serviço
  data: string;
  responsavel: string;
  // Integração com orçamento
  id_contrato?: string; // Vínculo com orçamento aprovado
  hh_executado_total: number;
  hh_previsto_dia: number;
  desvio_produtividade: number;
  custo_hh_realizado: number;
  validacao_tecnica: ValidacaoTecnica;
  // Condições ambientais
  clima: 'sol' | 'chuva' | 'nublado' | 'vento';
  temperatura: number;
  // Status expandido
  status: 'rascunho' | 'pendente' | 'aprovado' | 'alerta' | 'em_execucao' | 'finalizado';
  // Dados técnicos
  atividades: Atividade[];
  equipes: EquipeRDO[];
  fotos: Foto[];
  equipamentos?: Equipamento[];
  materiais?: Material[];
  ocorrencias?: Ocorrencia[];
  checklists?: ChecklistTecnico[];
  observacoes?: string;
  assinatura?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Atividade {
  id: string;
  tipo: 'obra_civil' | 'manutencao_eletrica' | 'manutencao_mecanica' | 'manutencao_civil' | 'inspecao';
  descricao: string;
  inicio: string;
  fim: string;
  percentual: number;
  responsavel: string;
  especialidade?: string; // NR-10, NR-12, etc.
  ativo_relacionado?: string; // Para manutenção industrial
  status: 'nao_iniciado' | 'em_andamento' | 'concluido' | 'pausado' | 'cancelado';
  observacoes_tecnicas?: string;
}

export interface EquipeRDO {
  id: string;
  funcionario: string;
  cargo: string;
  horaInicio: string;
  horaFim: string;
  horasTrabalhadas: number;
  observacoes?: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  cpf: string;
  telefone: string;
  email?: string;
  status: 'ativo' | 'inativo';
  dataAdmissao: string;
  salario?: number;
  especialidades: string[];
  certificacoes?: Certificacao[];
  valor_hora?: number;
  // Configurações de jornada e HH
  jornada_normal_dia: number; // ex: 8 horas
  limite_he_semanal: number; // ex: 10 horas extras por semana
  horario_noturno_inicio: string; // ex: "22:00"
  horario_noturno_fim: string; // ex: "05:00"
  percentual_he_60: number; // padrão 1.6
  percentual_he_100: number; // padrão 2.0
  adicional_noturno: number; // padrão 0.25 = 25%
}

export interface Equipe {
  id: string;
  nome: string;
  lider: string;
  membros: string[];
  obra: string;
  status: 'ativa' | 'inativa';
}

export interface Foto {
  id: string;
  url: string;
  descricao: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Obra {
  id: string;
  nome: string;
  endereco: string;
  cliente: string;
  dataInicio: string;
  dataFim?: string;
  status: 'planejamento' | 'em_andamento' | 'pausada' | 'concluida';
  valor?: number;
  engenheiro: string;
}

export interface Equipamento {
  id: string;
  nome: string;
  tipo: string;
  categoria: 'obra_civil' | 'industrial' | 'medicao' | 'seguranca';
  horaInicio: string;
  horaFim: string;
  horasUsadas: number;
  status: 'disponivel' | 'em_uso' | 'manutencao' | 'calibracao';
  certificacao?: string; // Para equipamentos que precisam calibração
  observacoes?: string;
}

export interface Material {
  id: string;
  nome: string;
  categoria: 'eletrico' | 'mecanico' | 'civil' | 'seguranca' | 'consumivel';
  quantidade_usada: number;
  unidade: string;
  codigo_interno?: string;
  observacoes?: string;
}

export interface ChecklistTecnico {
  id: string;
  tipo: 'nr10' | 'nr12' | 'apr' | 'pt' | 'iso9001' | 'custom';
  nome: string;
  itens: ChecklistItem[];
  responsavel: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'nao_conforme';
  observacoes?: string;
}

export interface ChecklistItem {
  id: string;
  descricao: string;
  status: 'ok' | 'nok' | 'na' | 'pendente';
  observacoes?: string;
  foto_evidencia?: string;
}

export interface Ocorrencia {
  id: string;
  tipo: 'acidente' | 'paralisacao' | 'mudanca_projeto' | 'clima_extremo' | 'entrega' | 'falha_tecnica' | 'risco_eletrico' | 'parada_emergencial';
  categoria: 'seguranca' | 'qualidade' | 'prazo' | 'tecnica' | 'ambiental';
  descricao: string;
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  timestamp: string;
  responsavel: string;
  ativo_afetado?: string;
  acoes_tomadas?: string;
  status_resolucao: 'aberta' | 'em_tratamento' | 'resolvida' | 'cancelada';
}

export interface DashboardMetrics {
  rdosHoje: number;
  rdosPendentes: number;
  obrasAtivas: number;
  funcionariosAtivos: number;
  horasTrabalhadasSemana: number;
  produtividadeSemana: number;
}

export interface Certificacao {
  id: string;
  nome: string;
  orgao_emissor: string;
  numero: string;
  data_emissao: string;
  data_vencimento?: string;
  arquivo_certificado?: string;
  // Campos expandidos para treinamentos
  tipo: 'certificacao' | 'treinamento' | 'curso';
  categoria: 'nr' | 'crea' | 'tecnico' | 'operacional' | 'seguranca' | 'qualidade';
  status: 'valida' | 'vencida' | 'proximo_vencimento' | 'pendente_renovacao';
  carga_horaria?: number;
  instrutor?: string;
  local_treinamento?: string;
  observacoes?: string;
  renovacoes?: HistoricoRenovacao[];
}

export interface HistoricoRenovacao {
  id: string;
  data_renovacao: string;
  nova_validade: string;
  observacoes?: string;
}

export interface EquipamentoMaster {
  id: string;
  nome: string;
  tipo: string;
  categoria: 'obra_civil' | 'industrial' | 'medicao' | 'seguranca';
  valor_hora?: number;
  manutencao_preventiva: number; // dias
  calibracao_obrigatoria: boolean;
  status: 'disponivel' | 'em_uso' | 'manutencao' | 'calibracao';
  observacoes?: string;
  certificacao?: string;
  data_aquisicao?: string;
  vida_util_anos?: number;
}

// Integração CRM → Orçamento → RDO
export interface ValidacaoTecnica {
  funcionario_certificado: boolean;
  equipamento_calibrado: boolean;
  conformidade_nr: string[];
  alertas: string[];
}

export interface Oportunidade {
  id: string;
  id_lead: string;
  descricao_escopo: string;
  valor_estimado: number;
  status: 'negociacao' | 'proposta_enviada' | 'aprovada' | 'perdida';
  responsavel_comercial: string;
  data_criacao: string;
}

export interface Orcamento {
  id: string;
  id_oportunidade: string;
  tipo: 'obra_civil' | 'manutencao_industrial';
  composicoes: ComposicaoOrcamento[];
  hh_previsto_total: number;
  valor_hh_medio: number;
  valor_total: number;
  status: 'em_elaboracao' | 'enviado' | 'aprovado' | 'recusado';
  data_criacao: string;
}

export interface ComposicaoOrcamento {
  id: string;
  id_orcamento: string;
  descricao: string;
  codigo_tcpo_sinapi?: string;
  tipo: 'material' | 'hh' | 'equipamento';
  quantidade: number;
  valor_unitario: number;
  hh_unitario?: number;
  valor_hh?: number;
}

export interface Contrato {
  id: string;
  id_orcamento: string;
  data_assinatura: string;
  prazo_execucao: number; // dias
  valor_fechado: number;
  tipo_execucao: 'escopo' | 'por_hh' | 'hibrido';
  status: 'ativo' | 'concluido' | 'cancelado';
}

// Cronograma e Projetos
export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'obra-civil' | 'manutencao' | 'instalacao' | 'reforma' | 'consultoria';
  status: 'planejado' | 'em-andamento' | 'atrasado' | 'concluido';
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  client: string;
  responsible: string;
  budget: number;
}

export interface Activity {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'planejado' | 'em-andamento' | 'atrasado' | 'concluido';
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  assignedTeam: string;
  dependencies: string[];
  critical: boolean;
}

// Boletim de Medição
export interface BoletimMedicao {
  id: string;
  rdo_id: string; // IDs dos RDOs (separados por vírgula se consolidado)
  obra_nome?: string; // Nome da obra
  data_inicio?: string; // Data de início (para boletins de período)
  data_fim?: string; // Data de fim (para boletins de período)
  periodo_dias?: number; // Quantidade de dias do período
  data: string; // Data de referência
  funcionarios: FuncionarioBoletim[];
  equipamentos: EquipamentoBoletim[];
  materiais: MaterialBoletim[];
  resumo_financeiro: ResumoFinanceiro;
  status: 'rascunho' | 'aprovado' | 'faturado';
  criado_em: string;
  aprovado_em?: string;
  aprovado_por?: string;
}

export interface FuncionarioBoletim {
  funcionario_id: string;
  funcionario_nome: string;
  cargo: string;
  valor_hora_normal: number;
  // Horas trabalhadas por tipo
  hh_normais: number;
  hh_extras_60: number;
  hh_extras_100: number;
  hh_noturnas: number;
  hh_domingo_feriado: number;
  // Valores calculados
  valor_hh_normais: number;
  valor_hh_extras_60: number;
  valor_hh_extras_100: number;
  valor_hh_noturnas: number;
  valor_hh_domingo_feriado: number;
  valor_total: number;
  // Controle semanal
  hh_extras_semana_atual: number;
  limite_he_atingido: boolean;
}

export interface EquipamentoBoletim {
  equipamento_id: string;
  equipamento_nome: string;
  categoria: string;
  horas_utilizadas: number;
  valor_hora: number;
  valor_total: number;
  responsavel: string;
}

export interface MaterialBoletim {
  material_id: string;
  material_nome: string;
  categoria: string;
  quantidade_utilizada: number;
  unidade: string;
  valor_unitario: number;
  valor_total: number;
}

export interface ResumoFinanceiro {
  total_funcionarios: number;
  total_equipamentos: number;
  total_materiais: number;
  total_geral: number;
  // Detalhamento por tipo de HH
  total_hh_normais: number;
  total_hh_extras_60: number;
  total_hh_extras_100: number;
  total_hh_noturnas: number;
  total_hh_domingo_feriado: number;
}

export interface ClassificacaoHH {
  funcionario_id: string;
  hora_inicio: string;
  hora_fim: string;
  total_horas: number;
  hh_normais: number;
  hh_extras_60: number;
  hh_extras_100: number;
  hh_noturnas: number;
  eh_domingo_feriado: boolean;
}

// Entidades CRM Integradas
export interface Lead {
  id: string;
  nome_cliente: string;
  empresa?: string;
  email: string;
  telefone: string;
  origem: 'site' | 'indicacao' | 'evento' | 'cold_call' | 'linkedin';
  status: 'novo' | 'contatado' | 'qualificado' | 'desqualificado';
  tipo_servico: 'obra_civil' | 'manutencao_industrial' | 'consultoria';
  valor_estimado?: number;
  descricao_necessidade: string;
  responsavel_comercial: string;
  data_contato: string;
  data_criacao: string;
  observacoes?: string;
  // Campos para conversão
  convertido_oportunidade?: boolean;
  id_oportunidade?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  cpf_cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  segmento?: string; // Construtora, Indústria, etc.
  // Histórico comercial
  data_cadastro: string;
  responsavel_comercial: string;
  // Métricas
  total_contratos: number;
  valor_total_historico: number;
  margem_media: number;
  tempo_medio_pagamento: number;
  status: 'ativo' | 'inativo' | 'inadimplente';
}

// Expandir Oportunidade existente
export interface OportunidadeExpandida extends Oportunidade {
  id_cliente: string;
  nome_cliente: string;
  empresa_cliente: string;
  tipo_servico: 'obra_civil' | 'manutencao_industrial' | 'consultoria';
  prazo_execucao_dias: number;
  observacoes_comerciais?: string;
  probabilidade_fechamento: number; // 0-100
  data_prevista_fechamento: string;
  // Vínculo com orçamento
  tem_orcamento: boolean;
  id_orcamento?: string;
  aprovada_orcamento?: boolean;
  // Histórico de ações comerciais
  historico_acoes: AcaoComercial[];
}

export interface AcaoComercial {
  id: string;
  tipo: 'ligacao' | 'email' | 'reuniao' | 'proposta' | 'negociacao';
  descricao: string;
  data: string;
  responsavel: string;
  resultado?: string;
  proxima_acao?: string;
  data_proxima_acao?: string;
}

// Expandir Orçamento existente com integração
export interface OrcamentoIntegrado extends Orcamento {
  id_cliente: string;
  nome_cliente: string;
  nome_projeto: string;
  endereco_execucao: string;
  // Dados técnicos expandidos
  prazo_execucao_dias: number;
  inicio_previsto: string;
  fim_previsto: string;
  margem_lucro_prevista: number;
  // Condições comerciais
  forma_pagamento: string;
  condicoes_especiais?: string;
  validade_proposta: string;
  // Aprovações
  aprovado_comercial: boolean;
  aprovado_tecnico: boolean;
  data_aprovacao?: string;
  // Integração com contrato
  virou_contrato: boolean;
  id_contrato?: string;
}

// Expandir Contrato existente
export interface ContratoIntegrado extends Contrato {
  id_cliente: string;
  nome_cliente: string;
  nome_projeto: string;
  endereco_execucao: string;
  // Execução e controle
  hh_executado_total: number;
  custo_executado_total: number;
  margem_real_atual: number;
  percentual_execucao: number;
  // Faturamento
  valor_faturado_total: number;
  valor_pendente_faturamento: number;
  // Datas importantes
  data_inicio_real?: string;
  data_fim_real?: string;
  // Status financeiro
  status_financeiro: 'em_dia' | 'atrasado' | 'inadimplente';
}

// Dashboard integrado
export interface DashboardIntegrado {
  // Métricas CRM
  leads_ativos: number;
  leads_mes: number;
  taxa_conversao_lead_oportunidade: number;
  // Pipeline comercial
  oportunidades_ativas: number;
  valor_pipeline_total: number;
  valor_pipeline_mes: number;
  probabilidade_media_fechamento: number;
  // Orçamentos e contratos
  orcamentos_pendentes: number;
  valor_orcamentos_pendentes: number;
  contratos_ativos: number;
  valor_contratos_ativos: number;
  // Execução e financeiro
  obras_em_andamento: number;
  margem_media_real: number;
  desvio_orcamentario_medio: number;
  valor_faturado_mes: number;
  valor_a_faturar: number;
  // Indicadores de performance
  prazo_medio_aprovacao_orcamento: number;
  tempo_medio_ciclo_comercial: number;
  ticket_medio_contrato: number;
}

// Integrações CRM Financeiro
export interface AnaliseFinanceira {
  contrato_id: string;
  nome_projeto: string;
  valor_contrato: number;
  custo_executado: number;
  margem_atual: number;
  margem_prevista: number;
  desvio_margem: number;
  percentual_execucao: number;
  valor_faturado: number;
  valor_a_faturar: number;
  projecao_resultado_final: number;
  status_financeiro: 'positivo' | 'atencao' | 'critico';
}

export interface ConsolidadoFinanceiro {
  total_contratos_ativos: number;
  valor_total_contratos: number;
  custo_total_executado: number;
  margem_total_atual: number;
  valor_total_faturado: number;
  valor_total_a_faturar: number;
  analises_por_contrato: AnaliseFinanceira[];
  resumo_por_cliente: {
    cliente_id: string;
    nome_cliente: string;
    valor_total: number;
    margem_media: number;
    contratos_ativos: number;
  }[];
}