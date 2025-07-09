import type { RDO, DashboardMetrics, User, Funcionario, Equipe, Obra, Certificacao, EquipamentoMaster, Equipamento, Lead, Cliente, OportunidadeExpandida, OrcamentoIntegrado, ContratoIntegrado, DashboardIntegrado } from '@/types';

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
    jornada_normal_dia: 8,
    limite_he_semanal: 10,
    horario_noturno_inicio: "22:00",
    horario_noturno_fim: "05:00",
    percentual_he_60: 1.6,
    percentual_he_100: 2.0,
    adicional_noturno: 0.25,
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
    jornada_normal_dia: 8,
    limite_he_semanal: 12,
    horario_noturno_inicio: "22:00",
    horario_noturno_fim: "05:00",
    percentual_he_60: 1.6,
    percentual_he_100: 2.0,
    adicional_noturno: 0.25,
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
    jornada_normal_dia: 8,
    limite_he_semanal: 10,
    horario_noturno_inicio: "22:00",
    horario_noturno_fim: "05:00",
    percentual_he_60: 1.6,
    percentual_he_100: 2.0,
    adicional_noturno: 0.25,
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
    jornada_normal_dia: 8,
    limite_he_semanal: 8,
    horario_noturno_inicio: "22:00",
    horario_noturno_fim: "05:00",
    percentual_he_60: 1.6,
    percentual_he_100: 2.0,
    adicional_noturno: 0.25,
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
    valor_hora: 42,
    jornada_normal_dia: 8,
    limite_he_semanal: 10,
    horario_noturno_inicio: "22:00",
    horario_noturno_fim: "05:00",
    percentual_he_60: 1.6,
    percentual_he_100: 2.0,
    adicional_noturno: 0.25
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
    jornada_normal_dia: 8,
    limite_he_semanal: 12,
    horario_noturno_inicio: "22:00",
    horario_noturno_fim: "05:00",
    percentual_he_60: 1.6,
    percentual_he_100: 2.0,
    adicional_noturno: 0.25,
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
    // Dados de HH e controle
    hh_executado_total: 16,
    hh_previsto_dia: 16,
    desvio_produtividade: 0,
    custo_hh_realizado: 750,
    validacao_tecnica: {
      funcionario_certificado: true,
      equipamento_calibrado: true,
      conformidade_nr: ['NR-18', 'NR-35'],
      alertas: []
    },
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
    // Dados de HH e controle
    hh_executado_total: 8,
    hh_previsto_dia: 8,
    desvio_produtividade: 0,
    custo_hh_realizado: 336,
    validacao_tecnica: {
      funcionario_certificado: true,
      equipamento_calibrado: false,
      conformidade_nr: ['NR-18'],
      alertas: ['Equipamento necessita calibração']
    },
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
    // Dados de HH e controle
    hh_executado_total: 16,
    hh_previsto_dia: 16,
    desvio_produtividade: -0.25,
    custo_hh_realizado: 1000,
    validacao_tecnica: {
      funcionario_certificado: true,
      equipamento_calibrado: true,
      conformidade_nr: ['NR-10', 'NR-12'],
      alertas: []
    },
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
// Dados CRM Integrados
export const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'Construtora Alpha Ltda',
    tipo: 'pessoa_juridica',
    cpf_cnpj: '12.345.678/0001-90',
    email: 'contato@alpha.com.br',
    telefone: '(11) 3333-4444',
    endereco: 'Av. Paulista, 1000 - Sala 200',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    segmento: 'Construtora',
    data_cadastro: '2023-01-15',
    responsavel_comercial: 'João Comercial',
    total_contratos: 3,
    valor_total_historico: 4200000,
    margem_media: 18.5,
    tempo_medio_pagamento: 35,
    status: 'ativo'
  },
  {
    id: '2', 
    nome: 'Grupo Beta S.A.',
    tipo: 'pessoa_juridica',
    cpf_cnpj: '98.765.432/0001-10',
    email: 'projetos@grupobeta.com.br',
    telefone: '(11) 5555-6666',
    endereco: 'Rua Augusta, 500 - 10º andar',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01305-000',
    segmento: 'Incorporadora',
    data_cadastro: '2023-02-01',
    responsavel_comercial: 'Maria Comercial',
    total_contratos: 2,
    valor_total_historico: 12300000,
    margem_media: 22.3,
    tempo_medio_pagamento: 28,
    status: 'ativo'
  },
  {
    id: '3',
    nome: 'Cimento Forte S.A.',
    tipo: 'pessoa_juridica', 
    cpf_cnpj: '55.666.777/0001-88',
    email: 'manutencao@cimentoforte.com.br',
    telefone: '(11) 7777-8888',
    endereco: 'Distrito Industrial, 100',
    cidade: 'Guarulhos',
    estado: 'SP',
    cep: '07140-000',
    segmento: 'Indústria',
    data_cadastro: '2022-11-10',
    responsavel_comercial: 'Carlos Comercial',
    total_contratos: 5,
    valor_total_historico: 8500000,
    margem_media: 25.8,
    tempo_medio_pagamento: 45,
    status: 'ativo'
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    nome_cliente: 'Industrial Nova Era',
    empresa: 'Nova Era Ltda',
    email: 'contato@novaera.com.br',
    telefone: '(11) 9999-0000',
    origem: 'site',
    status: 'qualificado',
    tipo_servico: 'manutencao_industrial',
    valor_estimado: 350000,
    descricao_necessidade: 'Manutenção preventiva em linha de produção',
    responsavel_comercial: 'João Comercial',
    data_contato: '2024-01-15',
    data_criacao: '2024-01-10',
    convertido_oportunidade: true,
    id_oportunidade: '4'
  },
  {
    id: '2',
    nome_cliente: 'Construtora Horizonte',
    empresa: 'Horizonte Construções',
    email: 'vendas@horizonte.com.br', 
    telefone: '(11) 8888-1111',
    origem: 'indicacao',
    status: 'contatado',
    tipo_servico: 'obra_civil',
    valor_estimado: 850000,
    descricao_necessidade: 'Construção de edifício residencial 15 andares',
    responsavel_comercial: 'Maria Comercial',
    data_contato: '2024-01-12',
    data_criacao: '2024-01-08',
    convertido_oportunidade: false
  },
  {
    id: '3',
    nome_cliente: 'Metalúrgica Sul',
    empresa: 'Sul Metais S.A.',
    email: 'projetos@sulmetais.com.br',
    telefone: '(11) 7777-2222',
    origem: 'linkedin',
    status: 'novo',
    tipo_servico: 'manutencao_industrial',
    valor_estimado: 180000,
    descricao_necessidade: 'Instalação de sistema de automação',
    responsavel_comercial: 'Carlos Comercial',
    data_contato: '2024-01-18',
    data_criacao: '2024-01-18'
  }
];

export const mockOportunidades: OportunidadeExpandida[] = [
  {
    id: '1',
    id_lead: '1',
    id_cliente: '1',
    nome_cliente: 'Construtora Alpha',
    empresa_cliente: 'Construtora Alpha Ltda',
    tipo_servico: 'obra_civil',
    descricao_escopo: 'Construção de edifício residencial 20 andares com 80 apartamentos',
    valor_estimado: 2500000,
    status: 'aprovada',
    responsavel_comercial: 'João Comercial',
    data_criacao: '2023-12-01',
    prazo_execucao_dias: 365,
    probabilidade_fechamento: 95,
    data_prevista_fechamento: '2024-01-15',
    tem_orcamento: true,
    id_orcamento: '1',
    aprovada_orcamento: true,
    historico_acoes: [
      {
        id: '1',
        tipo: 'reuniao',
        descricao: 'Reunião inicial para levantamento de requisitos',
        data: '2023-12-01',
        responsavel: 'João Comercial',
        resultado: 'Aprovação do escopo inicial'
      }
    ]
  },
  {
    id: '2',
    id_lead: '2', 
    id_cliente: '2',
    nome_cliente: 'Grupo Beta',
    empresa_cliente: 'Grupo Beta S.A.',
    tipo_servico: 'obra_civil',
    descricao_escopo: 'Shopping Center com 150 lojas e cinema',
    valor_estimado: 8500000,
    status: 'aprovada',
    responsavel_comercial: 'Maria Comercial',
    data_criacao: '2023-11-15',
    prazo_execucao_dias: 730,
    probabilidade_fechamento: 90,
    data_prevista_fechamento: '2024-02-01',
    tem_orcamento: true,
    id_orcamento: '2',
    aprovada_orcamento: true,
    historico_acoes: []
  },
  {
    id: '3',
    id_lead: '3',
    id_cliente: '3', 
    nome_cliente: 'Cimento Forte',
    empresa_cliente: 'Cimento Forte S.A.',
    tipo_servico: 'manutencao_industrial',
    descricao_escopo: 'Manutenção completa linha de produção cimento',
    valor_estimado: 5000000,
    status: 'aprovada',
    responsavel_comercial: 'Carlos Comercial',
    data_criacao: '2023-12-15',
    prazo_execucao_dias: 180,
    probabilidade_fechamento: 88,
    data_prevista_fechamento: '2024-01-01',
    tem_orcamento: true,
    id_orcamento: '3',
    aprovada_orcamento: true,
    historico_acoes: []
  },
  {
    id: '4',
    id_lead: '1',
    id_cliente: '1',
    nome_cliente: 'Industrial Nova Era',
    empresa_cliente: 'Nova Era Ltda',
    tipo_servico: 'manutencao_industrial',
    descricao_escopo: 'Manutenção preventiva equipamentos industriais',
    valor_estimado: 350000,
    status: 'proposta_enviada',
    responsavel_comercial: 'João Comercial',
    data_criacao: '2024-01-15',
    prazo_execucao_dias: 60,
    probabilidade_fechamento: 75,
    data_prevista_fechamento: '2024-02-15',
    tem_orcamento: true,
    id_orcamento: '4',
    aprovada_orcamento: false,
    historico_acoes: []
  }
];

export const mockOrcamentos: OrcamentoIntegrado[] = [
  {
    id: '1',
    id_oportunidade: '1',
    id_cliente: '1',
    nome_cliente: 'Construtora Alpha',
    nome_projeto: 'Edifício Residencial Sunset',
    endereco_execucao: 'Rua das Flores, 123 - Bairro Jardim',
    tipo: 'obra_civil',
    composicoes: [
      {
        id: '1',
        id_orcamento: '1',
        descricao: 'Fundação e estrutura',
        quantidade: 1200,
        valor_unitario: 850,
        tipo: 'hh',
        hh_unitario: 1.2,
        valor_hh: 45
      }
    ],
    hh_previsto_total: 1440,
    valor_hh_medio: 45,
    valor_total: 2500000,
    status: 'aprovado',
    data_criacao: '2023-12-05',
    prazo_execucao_dias: 365,
    inicio_previsto: '2024-01-15',
    fim_previsto: '2025-01-15',
    margem_lucro_prevista: 18.5,
    forma_pagamento: '30% entrada, 70% conforme medição',
    validade_proposta: '2024-01-31',
    aprovado_comercial: true,
    aprovado_tecnico: true,
    data_aprovacao: '2024-01-10',
    virou_contrato: true,
    id_contrato: '1'
  },
  {
    id: '2',
    id_oportunidade: '2',
    id_cliente: '2',
    nome_cliente: 'Grupo Beta',
    nome_projeto: 'Shopping Center Plaza',
    endereco_execucao: 'Av. Principal, 456 - Centro',
    tipo: 'obra_civil',
    composicoes: [],
    hh_previsto_total: 5000,
    valor_hh_medio: 48,
    valor_total: 8500000,
    status: 'aprovado',
    data_criacao: '2023-11-20',
    prazo_execucao_dias: 730,
    inicio_previsto: '2024-02-01',
    fim_previsto: '2026-02-01',
    margem_lucro_prevista: 22.3,
    forma_pagamento: '20% entrada, 80% conforme cronograma',
    validade_proposta: '2024-02-15',
    aprovado_comercial: true,
    aprovado_tecnico: true,
    data_aprovacao: '2024-01-25',
    virou_contrato: true,
    id_contrato: '2'
  },
  {
    id: '3',
    id_oportunidade: '3',
    id_cliente: '3',
    nome_cliente: 'Cimento Forte',
    nome_projeto: 'Manutenção Linha Produção',
    endereco_execucao: 'Distrito Industrial - Zona Norte',
    tipo: 'manutencao_industrial',
    composicoes: [],
    hh_previsto_total: 2500,
    valor_hh_medio: 65,
    valor_total: 5000000,
    status: 'aprovado',
    data_criacao: '2023-12-20',
    prazo_execucao_dias: 180,
    inicio_previsto: '2024-01-01',
    fim_previsto: '2024-06-30',
    margem_lucro_prevista: 25.8,
    forma_pagamento: 'Mensal conforme execução',
    validade_proposta: '2024-01-15',
    aprovado_comercial: true,
    aprovado_tecnico: true,
    data_aprovacao: '2023-12-28',
    virou_contrato: true,
    id_contrato: '3'
  },
  {
    id: '4',
    id_oportunidade: '4',
    id_cliente: '1',
    nome_cliente: 'Industrial Nova Era',
    nome_projeto: 'Manutenção Preventiva Equipamentos',
    endereco_execucao: 'Zona Industrial Nova Era',
    tipo: 'manutencao_industrial',
    composicoes: [],
    hh_previsto_total: 800,
    valor_hh_medio: 55,
    valor_total: 350000,
    status: 'enviado',
    data_criacao: '2024-01-18',
    prazo_execucao_dias: 60,
    inicio_previsto: '2024-02-15',
    fim_previsto: '2024-04-15',
    margem_lucro_prevista: 20.0,
    forma_pagamento: '50% entrada, 50% final',
    validade_proposta: '2024-02-28',
    aprovado_comercial: false,
    aprovado_tecnico: true,
    virou_contrato: false
  }
];

export const mockContratos: ContratoIntegrado[] = [
  {
    id: '1',
    id_orcamento: '1',
    id_cliente: '1',
    nome_cliente: 'Construtora Alpha',
    nome_projeto: 'Edifício Residencial Sunset',
    endereco_execucao: 'Rua das Flores, 123 - Bairro Jardim',
    data_assinatura: '2024-01-15',
    prazo_execucao: 365,
    valor_fechado: 2500000,
    tipo_execucao: 'escopo',
    status: 'ativo',
    hh_executado_total: 160,
    custo_executado_total: 75000,
    margem_real_atual: 17.2,
    percentual_execucao: 15.5,
    valor_faturado_total: 375000,
    valor_pendente_faturamento: 125000,
    data_inicio_real: '2024-01-15',
    status_financeiro: 'em_dia'
  },
  {
    id: '2',
    id_orcamento: '2',
    id_cliente: '2',
    nome_cliente: 'Grupo Beta',
    nome_projeto: 'Shopping Center Plaza',
    endereco_execucao: 'Av. Principal, 456 - Centro',
    data_assinatura: '2024-02-01',
    prazo_execucao: 730,
    valor_fechado: 8500000,
    tipo_execucao: 'escopo',
    status: 'ativo',
    hh_executado_total: 80,
    custo_executado_total: 33600,
    margem_real_atual: 21.8,
    percentual_execucao: 2.5,
    valor_faturado_total: 170000,
    valor_pendente_faturamento: 425000,
    data_inicio_real: '2024-02-01',
    status_financeiro: 'em_dia'
  },
  {
    id: '3',
    id_orcamento: '3',
    id_cliente: '3',
    nome_cliente: 'Cimento Forte',
    nome_projeto: 'Manutenção Linha Produção',
    endereco_execucao: 'Distrito Industrial - Zona Norte',
    data_assinatura: '2024-01-01',
    prazo_execucao: 180,
    valor_fechado: 5000000,
    tipo_execucao: 'por_hh',
    status: 'ativo',
    hh_executado_total: 240,
    custo_executado_total: 100000,
    margem_real_atual: 24.2,
    percentual_execucao: 12.8,
    valor_faturado_total: 640000,
    valor_pendente_faturamento: 250000,
    data_inicio_real: '2024-01-01',
    status_financeiro: 'em_dia'
  }
];

export const mockDashboardIntegrado: DashboardIntegrado = {
  // Métricas CRM
  leads_ativos: 3,
  leads_mes: 12,
  taxa_conversao_lead_oportunidade: 68.5,
  // Pipeline comercial
  oportunidades_ativas: 4,
  valor_pipeline_total: 16350000,
  valor_pipeline_mes: 2400000,
  probabilidade_media_fechamento: 87.0,
  // Orçamentos e contratos
  orcamentos_pendentes: 1,
  valor_orcamentos_pendentes: 350000,
  contratos_ativos: 3,
  valor_contratos_ativos: 16000000,
  // Execução e financeiro
  obras_em_andamento: 3,
  margem_media_real: 21.1,
  desvio_orcamentario_medio: -2.3,
  valor_faturado_mes: 485000,
  valor_a_faturar: 800000,
  // Indicadores de performance
  prazo_medio_aprovacao_orcamento: 8,
  tempo_medio_ciclo_comercial: 42,
  ticket_medio_contrato: 5333333
};

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
  if (!localStorage.getItem('clientes')) {
    setStorageData('clientes', mockClientes);
  }
  if (!localStorage.getItem('leads')) {
    setStorageData('leads', mockLeads);
  }
  if (!localStorage.getItem('oportunidades')) {
    setStorageData('oportunidades', mockOportunidades);
  }
  if (!localStorage.getItem('orcamentos')) {
    setStorageData('orcamentos', mockOrcamentos);
  }
  if (!localStorage.getItem('contratos')) {
    setStorageData('contratos', mockContratos);
  }
};