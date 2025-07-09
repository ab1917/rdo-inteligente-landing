export interface Database {
  public: {
    Tables: {
      funcionarios: {
        Row: {
          id: string;
          nome: string;
          cargo: string;
          salario: number;
          data_admissao: string;
          cpf: string;
          email: string;
          telefone: string;
          endereco: string;
          status: 'ativo' | 'inativo' | 'ferias' | 'afastado';
          especialidades: string[];
          certificacoes: {
            id: string;
            nome: string;
            entidade: string;
            dataObtencao: string;
            dataVencimento: string;
            status: 'valida' | 'vencida' | 'em_processo';
            anexo?: string;
          }[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['funcionarios']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['funcionarios']['Insert']>;
      };
      equipes: {
        Row: {
          id: string;
          nome: string;
          lider_id: string;
          descricao: string;
          area: string;
          funcionario_ids: string[];
          projetos_ativos: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['equipes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['equipes']['Insert']>;
      };
      equipamentos: {
        Row: {
          id: string;
          nome: string;
          tipo: string;
          marca: string;
          modelo: string;
          numero_serie: string;
          status: 'disponivel' | 'em_uso' | 'manutencao' | 'inativo';
          localizacao: string;
          responsavel_id: string;
          valor_aquisicao: number;
          data_aquisicao: string;
          data_ultima_manutencao?: string;
          proxima_manutencao?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['equipamentos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['equipamentos']['Insert']>;
      };
      obras: {
        Row: {
          id: string;
          nome: string;
          cliente: string;
          endereco: string;
          data_inicio: string;
          data_fim_prevista: string;
          status: 'planejamento' | 'em_andamento' | 'pausada' | 'concluida' | 'cancelada';
          valor_contrato: number;
          percentual_execucao: number;
          responsavel_tecnico_id: string;
          equipe_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['obras']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['obras']['Insert']>;
      };
      rdos: {
        Row: {
          id: string;
          obra_id: string;
          data: string;
          clima: 'sol' | 'chuva' | 'nublado' | 'garoa';
          temperatura: number;
          funcionarios_presentes: {
            id: string;
            nome: string;
            cargo: string;
            horas_trabalhadas: number;
            atividades: string[];
          }[];
          equipamentos_utilizados: {
            id: string;
            nome: string;
            horas_utilizacao: number;
            operador_id: string;
            combustivel_gasto?: number;
          }[];
          atividades_executadas: {
            id: string;
            descricao: string;
            local: string;
            inicio: string;
            fim: string;
            responsavel_id: string;
            status: 'iniciada' | 'em_andamento' | 'concluida' | 'pausada';
            observacoes?: string;
            percentual_conclusao: number;
          }[];
          materiais_utilizados: {
            id: string;
            nome: string;
            quantidade: number;
            unidade: string;
            fornecedor?: string;
          }[];
          fotos: {
            id: string;
            url: string;
            descricao: string;
            timestamp: string;
            categoria: 'progresso' | 'problema' | 'seguranca' | 'qualidade';
          }[];
          observacoes_gerais: string;
          problemas_encontrados: string[];
          status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';
          criado_por_id: string;
          aprovado_por_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['rdos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['rdos']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          nome_contato: string;
          empresa: string;
          email: string;
          telefone: string;
          fonte: string;
          interesse: string;
          valor_estimado: number;
          status: 'novo' | 'qualificado' | 'descartado' | 'convertido';
          data_criacao: string;
          ultima_interacao: string;
          responsavel_id: string;
          observacoes: string;
          convertido_oportunidade: boolean;
          id_oportunidade?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      clientes: {
        Row: {
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
          status: 'ativo' | 'inativo' | 'prospect';
          data_cadastro: string;
          responsavel_comercial_id: string;
          observacoes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clientes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clientes']['Insert']>;
      };
      oportunidades: {
        Row: {
          id: string;
          id_lead?: string;
          id_cliente: string;
          nome_projeto: string;
          descricao: string;
          valor_estimado: number;
          probabilidade: number;
          estagio: 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento';
          data_criacao: string;
          data_fechamento_prevista: string;
          responsavel_comercial: string;
          tipo_projeto: string;
          prazo_execucao_estimado: number;
          requisitos_tecnicos: string;
          concorrentes: string[];
          historico_acoes: {
            id: string;
            tipo: 'ligacao' | 'email' | 'reuniao' | 'proposta' | 'visita';
            descricao: string;
            data: string;
            responsavel: string;
            resultado: string;
          }[];
          status: 'ativa' | 'ganha' | 'perdida' | 'pausada';
          motivo_perda?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['oportunidades']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['oportunidades']['Insert']>;
      };
      orcamentos: {
        Row: {
          id: string;
          id_oportunidade: string;
          id_cliente: string;
          nome_cliente: string;
          nome_projeto: string;
          endereco_execucao: string;
          data_criacao: string;
          validade_dias: number;
          prazo_execucao_dias: number;
          responsavel_comercial: string;
          responsavel_tecnico: string;
          escopo_servicos: string;
          hh_previsto_total: number;
          custo_mao_obra: number;
          custo_materiais: number;
          custo_equipamentos: number;
          custo_terceiros: number;
          custos_indiretos: number;
          valor_total: number;
          margem_lucro_prevista: number;
          condicoes_pagamento: string;
          observacoes_tecnicas: string;
          status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';
          aprovado_comercial: boolean;
          aprovado_tecnico: boolean;
          data_aprovacao?: string;
          virou_contrato: boolean;
          id_contrato?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orcamentos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orcamentos']['Insert']>;
      };
      contratos: {
        Row: {
          id: string;
          id_orcamento: string;
          id_cliente: string;
          nome_cliente: string;
          nome_projeto: string;
          endereco_execucao: string;
          data_assinatura: string;
          prazo_execucao: number;
          valor_fechado: number;
          tipo_execucao: 'escopo' | 'administracao';
          status: 'ativo' | 'pausado' | 'concluido' | 'cancelado';
          hh_executado_total: number;
          custo_executado_total: number;
          margem_real_atual: number;
          percentual_execucao: number;
          valor_faturado_total: number;
          valor_pendente_faturamento: number;
          status_financeiro: 'em_dia' | 'atraso' | 'inadimplencia';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contratos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contratos']['Insert']>;
      };
      boletins_medicao: {
        Row: {
          id: string;
          obra_id: string;
          periodo_inicio: string;
          periodo_fim: string;
          responsavel_medicao: string;
          responsavel_aprovacao: string;
          data_medicao: string;
          data_aprovacao?: string;
          servicos_executados: {
            id: string;
            descricao: string;
            unidade: string;
            quantidade_prevista: number;
            quantidade_executada: number;
            valor_unitario: number;
            valor_total: number;
            percentual_execucao: number;
          }[];
          valor_total_periodo: number;
          valor_acumulado: number;
          percentual_fisico_periodo: number;
          percentual_fisico_acumulado: number;
          observacoes: string;
          status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['boletins_medicao']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['boletins_medicao']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          nome: string;
          descricao: string;
          cliente: string;
          data_inicio: string;
          data_fim: string;
          status: 'planejamento' | 'em_andamento' | 'pausado' | 'concluido' | 'cancelado';
          valor_orcado: number;
          gerente_projeto_id: string;
          equipe_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      activities: {
        Row: {
          id: string;
          project_id: string;
          nome: string;
          descricao: string;
          data_inicio: string;
          data_fim: string;
          duracao_dias: number;
          dependencias: string[];
          responsavel_id: string;
          status: 'nao_iniciada' | 'em_andamento' | 'concluida' | 'atrasada';
          percentual_conclusao: number;
          predecessor_ids: string[];
          sucessor_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['activities']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}