import type { RDO, DashboardMetrics, User, Funcionario, Equipe, Obra, Certificacao, EquipamentoMaster, Equipamento } from '@/types';

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

export const funcionariosData: Funcionario[] = [
  {
    id: '1',
    nome: 'João Silva',
    cargo: 'Pedreiro',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    status: 'ativo',
    dataAdmissao: '2023-01-15',
    salario: 3500,
    especialidades: ['Alvenaria', 'Reboco', 'Estrutural'],
    valor_hora: 35,
    certificacoes: [
      {
        id: '1',
        nome: 'NR-35 Trabalho em Altura',
        orgao_emissor: 'SENAI',
        numero: 'NR35-2023-001',
        data_emissao: '2023-01-10',
        data_vencimento: '2025-01-10',
        tipo: 'treinamento',
        categoria: 'nr',
        status: 'valida',
        carga_horaria: 8,
        instrutor: 'José Silva'
      }
    ]
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cargo: 'Eletricista',
    cpf: '987.654.321-00',
    telefone: '(11) 88888-8888',
    email: 'maria@email.com',
    status: 'ativo',
    dataAdmissao: '2023-03-10',
    salario: 4200,
    especialidades: ['Elétrica Predial', 'Elétrica Industrial', 'NR-10'],
    valor_hora: 55,
    certificacoes: [
      {
        id: '2',
        nome: 'NR-10 Segurança em Instalações Elétricas',
        orgao_emissor: 'SENAI',
        numero: 'NR10-2023-045',
        data_emissao: '2023-02-15',
        data_vencimento: '2025-02-15',
        tipo: 'treinamento',
        categoria: 'nr',
        status: 'valida',
        carga_horaria: 40,
        instrutor: 'Carlos Eletricista'
      },
      {
        id: '3',
        nome: 'NR-35 Trabalho em Altura',
        orgao_emissor: 'SENAI',
        numero: 'NR35-2023-067',
        data_emissao: '2023-02-20',
        data_vencimento: '2025-02-20',
        tipo: 'treinamento',
        categoria: 'nr',
        status: 'valida',
        carga_horaria: 8,
        instrutor: 'Ana Segurança'
      }
    ]
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    cargo: 'Soldador',
    cpf: '456.789.123-00',
    telefone: '(11) 77777-7777',
    email: 'carlos@email.com',
    status: 'ativo',
    dataAdmissao: '2022-11-05',
    salario: 4800,
    especialidades: ['Solda Elétrica', 'Solda TIG', 'Solda MIG'],
    valor_hora: 60,
    certificacoes: [
      {
        id: '4',
        nome: 'NR-18 Condições de Segurança',
        orgao_emissor: 'SENAI',
        numero: 'NR18-2022-123',
        data_emissao: '2022-10-15',
        data_vencimento: '2024-10-15',
        tipo: 'treinamento',
        categoria: 'nr',
        status: 'proximo_vencimento',
        carga_horaria: 16,
        instrutor: 'Pedro Segurança'
      }
    ]
  },
  {
    id: '4',
    nome: 'Ana Costa',
    cargo: 'Técnica em Mecânica',
    cpf: '789.123.456-00',
    telefone: '(11) 66666-6666',
    email: 'ana@email.com',
    status: 'ativo',
    dataAdmissao: '2023-06-01',
    salario: 5200,
    especialidades: ['Manutenção Mecânica', 'Instrumentação', 'NR-12'],
    valor_hora: 65,
    certificacoes: [
      {
        id: '5',
        nome: 'NR-12 Segurança no Trabalho em Máquinas',
        orgao_emissor: 'SENAI',
        numero: 'NR12-2023-089',
        data_emissao: '2023-05-20',
        data_vencimento: '2025-05-20',
        tipo: 'treinamento',
        categoria: 'nr',
        status: 'valida',
        carga_horaria: 20,
        instrutor: 'Roberto Técnico',
        local_treinamento: 'SENAI - Unidade Industrial'
      }
    ]
  },
  {
    id: '5',
    nome: 'Roberto Lima',
    cargo: 'Encanador',
    cpf: '321.654.987-00',
    telefone: '(11) 55555-5555',
    email: 'roberto@email.com',
    status: 'ativo',
    dataAdmissao: '2023-08-15',
    salario: 3800,
    especialidades: ['Hidráulica', 'Esgoto', 'Água Quente'],
    valor_hora: 42
  },
  {
    id: '6',
    nome: 'Fernanda Souza',
    cargo: 'Engenheira de Segurança',
    cpf: '654.987.321-00',
    telefone: '(11) 44444-4444',
    email: 'fernanda@email.com',
    status: 'ativo',
    dataAdmissao: '2022-02-01',
    salario: 8500,
    especialidades: ['Segurança do Trabalho', 'CIPA', 'Auditorias'],
    valor_hora: 95,
    certificacoes: [
      {
        id: '6',
        nome: 'Registro CREA',
        orgao_emissor: 'CREA-SP',
        numero: 'CREA-123456',
        data_emissao: '2020-01-15',
        tipo: 'certificacao',
        categoria: 'crea',
        status: 'valida'
      }
    ]
  }
];

export const equipesData: Equipe[] = [
  {
    id: '1',
    nome: 'Equipe Construção Civil',
    lider: '1',
    membros: ['1', '5'],
    obra: 'Construção Residencial Vila Nova',
    status: 'ativa'
  },
  {
    id: '2',
    nome: 'Equipe Elétrica Industrial',
    lider: '2',
    membros: ['2', '6'],
    obra: 'Parada Técnica - Fábrica Cimento ABC',
    status: 'ativa'
  },
  {
    id: '3',
    nome: 'Equipe Mecânica Especializada',
    lider: '4',
    membros: ['3', '4'],
    obra: 'Manutenção Linha de Produção',
    status: 'ativa'
  },
  {
    id: '4',
    nome: 'Equipe Multidisciplinar',
    lider: '6',
    membros: ['1', '2', '3', '4', '5'],
    obra: 'Projeto Industrial Complexo',
    status: 'inativa'
  }
];

export const equipamentosData: EquipamentoMaster[] = [
  {
    id: '1',
    nome: 'Betoneira 400L',
    tipo: 'Misturador',
    categoria: 'obra_civil',
    valor_hora: 25,
    manutencao_preventiva: 90,
    calibracao_obrigatoria: false,
    status: 'disponivel',
    observacoes: 'Equipamento em bom estado'
  },
  {
    id: '2',
    nome: 'Multímetro Digital Fluke',
    tipo: 'Instrumento de Medição',
    categoria: 'medicao',
    valor_hora: 15,
    manutencao_preventiva: 180,
    calibracao_obrigatoria: true,
    status: 'disponivel',
    observacoes: 'Calibração válida até 12/2024'
  },
  {
    id: '3',
    nome: 'Ponte Rolante 5T',
    tipo: 'Equipamento de Elevação',
    categoria: 'industrial',
    valor_hora: 120,
    manutencao_preventiva: 30,
    calibracao_obrigatoria: true,
    status: 'em_uso',
    observacoes: 'Em uso na linha de produção A'
  },
  {
    id: '4',
    nome: 'Kit de Ferramentas Elétricas',
    tipo: 'Ferramentas',
    categoria: 'industrial',
    valor_hora: 8,
    manutencao_preventiva: 120,
    calibracao_obrigatoria: false,
    status: 'disponivel'
  },
  {
    id: '5',
    nome: 'Detector de Gases',
    tipo: 'Equipamento de Segurança',
    categoria: 'seguranca',
    valor_hora: 35,
    manutencao_preventiva: 60,
    calibracao_obrigatoria: true,
    status: 'calibracao',
    observacoes: 'Enviado para calibração obrigatória'
  },
  {
    id: '6',
    nome: 'Prensa Hidráulica 50T',
    tipo: 'Equipamento Industrial',
    categoria: 'industrial',
    valor_hora: 95,
    manutencao_preventiva: 45,
    calibracao_obrigatoria: false,
    status: 'manutencao',
    observacoes: 'Manutenção preventiva em andamento'
  },
  {
    id: '7',
    nome: 'Andaime Móvel',
    tipo: 'Equipamento de Acesso',
    categoria: 'obra_civil',
    valor_hora: 12,
    manutencao_preventiva: 60,
    calibracao_obrigatoria: false,
    status: 'disponivel'
  },
  {
    id: '8',
    nome: 'Termômetro Industrial',
    tipo: 'Instrumento de Medição',
    categoria: 'medicao',
    valor_hora: 18,
    manutencao_preventiva: 90,
    calibracao_obrigatoria: true,
    status: 'disponivel',
    observacoes: 'Faixa de medição: -50°C a +500°C'
  }
];

// Manter compatibilidade com código existente
export const mockFuncionarios = funcionariosData;

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
    setStorageData('funcionarios', funcionariosData);
  }
  if (!localStorage.getItem('equipes')) {
    setStorageData('equipes', equipesData);
  }
  if (!localStorage.getItem('equipamentos')) {
    setStorageData('equipamentos', equipamentosData);
  }
  if (!localStorage.getItem('obras')) {
    setStorageData('obras', mockObras);
  }
};