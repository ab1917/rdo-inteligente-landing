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