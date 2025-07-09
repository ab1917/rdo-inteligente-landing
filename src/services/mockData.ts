import { RDO, Funcionario, Obra, DashboardMetrics, Equipamento } from '@/types';

// Mock equipamentos para indústria
export const mockEquipamentosIndustriais: Equipamento[] = [
  {
    id: '4',
    nome: 'Multímetro Fluke 87V',
    tipo: 'medicao',
    categoria: 'industrial',
    horaInicio: '08:00',
    horaFim: '17:00',
    horasUsadas: 9,
    status: 'disponivel',
    certificacao: 'Calibrado até 2024-12-31'
  },
  {
    id: '5',
    nome: 'Prensa Hidráulica 100T',
    tipo: 'prensa',
    categoria: 'industrial',
    horaInicio: '07:00',
    horaFim: '16:00',
    horasUsadas: 9,
    status: 'em_uso'
  }
];

// Mock equipamentos para obra civil
export const mockEquipamentos: Equipamento[] = [
  {
    id: '1',
    nome: 'Betoneira 400L',
    tipo: 'betoneira',
    categoria: 'obra_civil',
    horaInicio: '07:00',
    horaFim: '16:00',
    horasUsadas: 9,
    status: 'disponivel'
  },
  {
    id: '2',
    nome: 'Escavadeira Cat 320',
    tipo: 'escavadeira',
    categoria: 'obra_civil',
    horaInicio: '08:00',
    horaFim: '17:00',
    horasUsadas: 9,
    status: 'em_uso'
  },
  {
    id: '3',
    nome: 'Guindaste Torre',
    tipo: 'guindaste',
    categoria: 'obra_civil',
    horaInicio: '07:00',
    horaFim: '18:00',
    horasUsadas: 11,
    status: 'manutencao'
  }
];

export const mockObras: Obra[] = [
  {
    id: '1',
    nome: 'Edifício Residencial Sunset',
    endereco: 'Rua das Flores, 123 - Bairro Jardim',
    cliente: 'Construtora Alpha',
    dataInicio: '2024-01-15',
    status: 'em_andamento',
    valor: 2500000,
    engenheiro: 'João Silva'
  },
  {
    id: '2',
    nome: 'Shopping Center Plaza',
    endereco: 'Av. Principal, 456 - Centro',
    cliente: 'Grupo Beta',
    dataInicio: '2024-02-01',
    status: 'em_andamento',
    valor: 8500000,
    engenheiro: 'Maria Santos'
  },
  {
    id: '3',
    nome: 'Fábrica de Cimento Portland',
    endereco: 'Distrito Industrial - Zona Norte',
    cliente: 'Cimento Forte S.A.',
    dataInicio: '2024-01-01',
    status: 'em_andamento',
    valor: 5000000,
    engenheiro: 'Carlos Técnico'
  }
];

export const mockFuncionarios: Funcionario[] = [
  {
    id: '1',
    nome: 'Carlos Pereira',
    cargo: 'Pedreiro',
    cpf: '123.456.789-01',
    telefone: '(11) 99999-1111',
    email: 'carlos@email.com',
    status: 'ativo',
    dataAdmissao: '2023-06-15',
    salario: 3500
  },
  {
    id: '2',
    nome: 'Ana Costa',
    cargo: 'Eletricista Industrial',
    cpf: '987.654.321-02',
    telefone: '(11) 99999-2222',
    status: 'ativo',
    dataAdmissao: '2023-08-20'
  },
  {
    id: '3',
    nome: 'Roberto Lima',
    cargo: 'Mecânico Industrial',
    cpf: '456.789.123-03',
    telefone: '(11) 99999-3333',
    status: 'ativo',
    dataAdmissao: '2023-09-10'
  }
];

export const mockRDOs: RDO[] = [
  // RDO de obra civil
  {
    id: '1',
    tipo: 'obra_civil',
    obra: 'Edifício Residencial Sunset',
    cliente: 'Construtora Alpha',
    local: 'Rua das Flores, 123 - Bairro Jardim',
    data: '2024-01-08',
    responsavel: 'João Silva',
    clima: 'sol',
    temperatura: 28,
    status: 'aprovado',
    atividades: [
      {
        id: '1',
        tipo: 'obra_civil',
        descricao: 'Concretagem da laje do 3º andar',
        inicio: '07:00',
        fim: '16:00',
        percentual: 85,
        responsavel: 'Carlos Pereira',
        status: 'em_andamento'
      },
      {
        id: '2',
        tipo: 'obra_civil',
        descricao: 'Instalação elétrica 2º andar',
        inicio: '08:00',
        fim: '17:00',
        percentual: 100,
        responsavel: 'Ana Costa',
        status: 'concluido'
      }
    ],
    equipes: [
      {
        id: '1',
        funcionario: 'Carlos Pereira',
        cargo: 'Pedreiro',
        horaInicio: '07:00',
        horaFim: '16:00',
        horasTrabalhadas: 8
      },
      {
        id: '2',
        funcionario: 'Ana Costa',
        cargo: 'Eletricista',
        horaInicio: '08:00',
        horaFim: '17:00',
        horasTrabalhadas: 8
      }
    ],
    fotos: [
      {
        id: '1',
        url: '/api/placeholder/400/300',
        descricao: 'Laje 3º andar - início da concretagem',
        timestamp: '2024-01-08T07:30:00Z'
      },
      {
        id: '2',
        url: '/api/placeholder/400/300',
        descricao: 'Instalação elétrica - quadro principal',
        timestamp: '2024-01-08T14:00:00Z'
      }
    ],
    observacoes: 'Trabalho realizado conforme cronograma. Sem intercorrências.',
    createdAt: '2024-01-08T18:00:00Z',
    updatedAt: '2024-01-08T18:00:00Z'
  },
  {
    id: '2',
    tipo: 'obra_civil',
    obra: 'Shopping Center Plaza',
    cliente: 'Grupo Beta',
    local: 'Av. Principal, 456 - Centro',
    data: '2024-01-08',
    responsavel: 'Maria Santos',
    clima: 'nublado',
    temperatura: 22,
    status: 'pendente',
    atividades: [
      {
        id: '3',
        tipo: 'obra_civil',
        descricao: 'Montagem da estrutura metálica',
        inicio: '07:00',
        fim: '16:00',
        percentual: 60,
        responsavel: 'Roberto Lima',
        status: 'em_andamento'
      }
    ],
    equipes: [
      {
        id: '3',
        funcionario: 'Roberto Lima',
        cargo: 'Encanador',
        horaInicio: '07:00',
        horaFim: '16:00',
        horasTrabalhadas: 8
      }
    ],
    fotos: [
      {
        id: '3',
        url: '/api/placeholder/400/300',
        descricao: 'Estrutura metálica - progresso atual',
        timestamp: '2024-01-08T15:00:00Z'
      }
    ],
    observacoes: 'Aguardando aprovação do engenheiro responsável.',
    createdAt: '2024-01-08T17:30:00Z',
    updatedAt: '2024-01-08T17:30:00Z'
  },
  // RDO de manutenção industrial
  {
    id: '3',
    tipo: 'manutencao_industrial',
    obra: 'Fábrica de Cimento Portland',
    cliente: 'Cimento Forte S.A.',
    local: 'Unidade Industrial - Setor Moagem',
    setor: 'Produção - Linha 2',
    ativo: 'Moinho de Carvão MC-02',
    os_numero: 'OS-2024-0156',
    data: '2024-01-09',
    responsavel: 'Carlos Técnico',
    clima: 'sol',
    temperatura: 32,
    status: 'em_execucao',
    atividades: [
      {
        id: '4',
        tipo: 'manutencao_eletrica',
        descricao: 'Substituição de motor elétrico 50HP',
        inicio: '08:00',
        fim: '12:00',
        percentual: 75,
        responsavel: 'Ana Costa',
        especialidade: 'NR-10',
        ativo_relacionado: 'Motor MC-02-001',
        status: 'em_andamento',
        observacoes_tecnicas: 'Motor com rolamento danificado, substituição necessária'
      },
      {
        id: '5',
        tipo: 'manutencao_mecanica',
        descricao: 'Alinhamento e balanceamento do conjunto rotativo',
        inicio: '13:00',
        fim: '17:00',
        percentual: 30,
        responsavel: 'Roberto Lima',
        especialidade: 'NR-12',
        ativo_relacionado: 'Conjunto Rotativo MC-02',
        status: 'nao_iniciado'
      }
    ],
    equipes: [
      {
        id: '4',
        funcionario: 'Ana Costa',
        cargo: 'Eletricista Industrial',
        horaInicio: '08:00',
        horaFim: '17:00',
        horasTrabalhadas: 8
      },
      {
        id: '5',
        funcionario: 'Roberto Lima',
        cargo: 'Mecânico Industrial',
        horaInicio: '08:00',
        horaFim: '17:00',
        horasTrabalhadas: 8
      }
    ],
    fotos: [
      {
        id: '4',
        url: '/api/placeholder/400/300',
        descricao: 'Motor danificado antes da substituição',
        timestamp: '2024-01-09T08:30:00Z'
      },
      {
        id: '5',
        url: '/api/placeholder/400/300',
        descricao: 'Novo motor instalado',
        timestamp: '2024-01-09T11:45:00Z'
      }
    ],
    observacoes: 'Parada programada para manutenção preventiva. Atividades conforme plano de manutenção PM-2024.',
    createdAt: '2024-01-09T18:00:00Z',
    updatedAt: '2024-01-09T18:00:00Z'
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  rdosHoje: 3,
  rdosPendentes: 1,
  obrasAtivas: 3,
  funcionariosAtivos: 12,
  horasTrabalhadasSemana: 320,
  produtividadeSemana: 87
};

// Storage helpers
export const getStorageData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Initialize default data if not exists
export const initializeData = () => {
  if (!localStorage.getItem('rdos')) {
    setStorageData('rdos', mockRDOs);
  }
  if (!localStorage.getItem('funcionarios')) {
    setStorageData('funcionarios', mockFuncionarios);
  }
  if (!localStorage.getItem('obras')) {
    setStorageData('obras', mockObras);
  }
};