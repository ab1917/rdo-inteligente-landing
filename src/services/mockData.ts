import { RDO, Funcionario, Obra, DashboardMetrics } from '@/types';

// Mock data for demonstration
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
    cargo: 'Eletricista',
    cpf: '987.654.321-02',
    telefone: '(11) 99999-2222',
    status: 'ativo',
    dataAdmissao: '2023-08-20'
  },
  {
    id: '3',
    nome: 'Roberto Lima',
    cargo: 'Encanador',
    cpf: '456.789.123-03',
    telefone: '(11) 99999-3333',
    status: 'ativo',
    dataAdmissao: '2023-09-10'
  }
];

export const mockRDOs: RDO[] = [
  {
    id: '1',
    obra: 'Edifício Residencial Sunset',
    data: '2024-01-08',
    responsavel: 'João Silva',
    clima: 'sol',
    temperatura: 28,
    status: 'aprovado',
    atividades: [
      {
        id: '1',
        descricao: 'Concretagem da laje do 3º andar',
        inicio: '07:00',
        fim: '16:00',
        percentual: 85,
        responsavel: 'Carlos Pereira',
        status: 'em_andamento'
      },
      {
        id: '2',
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
    obra: 'Shopping Center Plaza',
    data: '2024-01-08',
    responsavel: 'Maria Santos',
    clima: 'nublado',
    temperatura: 22,
    status: 'pendente',
    atividades: [
      {
        id: '3',
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
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  rdosHoje: 3,
  rdosPendentes: 1,
  obrasAtivas: 2,
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