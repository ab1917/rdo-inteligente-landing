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
  obra: string;
  data: string;
  responsavel: string;
  clima: 'sol' | 'chuva' | 'nublado' | 'vento';
  temperatura: number;
  status: 'rascunho' | 'pendente' | 'aprovado' | 'alerta';
  atividades: Atividade[];
  equipes: EquipeRDO[];
  fotos: Foto[];
  equipamentos?: Equipamento[];
  ocorrencias?: Ocorrencia[];
  observacoes?: string;
  assinatura?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Atividade {
  id: string;
  descricao: string;
  inicio: string;
  fim: string;
  percentual: number;
  responsavel: string;
  status: 'nao_iniciado' | 'em_andamento' | 'concluido' | 'pausado';
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
  horaInicio: string;
  horaFim: string;
  horasUsadas: number;
  status: 'disponivel' | 'em_uso' | 'manutencao';
  observacoes?: string;
}

export interface Ocorrencia {
  id: string;
  tipo: 'acidente' | 'paralisacao' | 'mudanca_projeto' | 'clima_extremo' | 'entrega';
  descricao: string;
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  timestamp: string;
  responsavel: string;
  acoes_tomadas?: string;
}

export interface DashboardMetrics {
  rdosHoje: number;
  rdosPendentes: number;
  obrasAtivas: number;
  funcionariosAtivos: number;
  horasTrabalhadasSemana: number;
  produtividadeSemana: number;
}