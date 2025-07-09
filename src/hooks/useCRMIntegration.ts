import { useState, useEffect } from 'react';
import { Lead, Cliente, OportunidadeExpandida, OrcamentoIntegrado, ContratoIntegrado, DashboardIntegrado } from '@/types';
import { getStorageData, setStorageData, mockDashboardIntegrado } from '@/services/mockData';

export const useCRMIntegration = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [oportunidades, setOportunidades] = useState<OportunidadeExpandida[]>([]);
  const [orcamentos, setOrcamentos] = useState<OrcamentoIntegrado[]>([]);
  const [contratos, setContratos] = useState<ContratoIntegrado[]>([]);
  const [dashboard, setDashboard] = useState<DashboardIntegrado>(mockDashboardIntegrado);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      setLeads(getStorageData('leads', []));
      setClientes(getStorageData('clientes', []));
      setOportunidades(getStorageData('oportunidades', []));
      setOrcamentos(getStorageData('orcamentos', []));
      setContratos(getStorageData('contratos', []));
      calculateDashboard();
    } catch (error) {
      console.error('Erro ao carregar dados CRM:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboard = () => {
    const currentLeads = getStorageData<Lead[]>('leads', []);
    const currentOportunidades = getStorageData<OportunidadeExpandida[]>('oportunidades', []);
    const currentOrcamentos = getStorageData<OrcamentoIntegrado[]>('orcamentos', []);
    const currentContratos = getStorageData<ContratoIntegrado[]>('contratos', []);

    const dashboardData: DashboardIntegrado = {
      // Métricas CRM
      leads_ativos: currentLeads.filter(l => l.status !== 'desqualificado').length,
      leads_mes: currentLeads.filter(l => {
        const dataContato = new Date(l.data_contato);
        const mesAtual = new Date();
        return dataContato.getMonth() === mesAtual.getMonth() && 
               dataContato.getFullYear() === mesAtual.getFullYear();
      }).length,
      taxa_conversao_lead_oportunidade: currentLeads.length > 0 
        ? (currentLeads.filter(l => l.convertido_oportunidade).length / currentLeads.length) * 100 
        : 0,

      // Pipeline comercial
      oportunidades_ativas: currentOportunidades.filter(o => o.status !== 'perdida').length,
      valor_pipeline_total: currentOportunidades
        .filter(o => o.status !== 'perdida')
        .reduce((sum, o) => sum + o.valor_estimado, 0),
      valor_pipeline_mes: currentOportunidades
        .filter(o => {
          const dataCriacao = new Date(o.data_criacao);
          const mesAtual = new Date();
          return dataCriacao.getMonth() === mesAtual.getMonth() && 
                 dataCriacao.getFullYear() === mesAtual.getFullYear();
        })
        .reduce((sum, o) => sum + o.valor_estimado, 0),
      probabilidade_media_fechamento: currentOportunidades.length > 0
        ? currentOportunidades.reduce((sum, o) => sum + o.probabilidade_fechamento, 0) / currentOportunidades.length
        : 0,

      // Orçamentos e contratos
      orcamentos_pendentes: currentOrcamentos.filter(o => o.status === 'enviado').length,
      valor_orcamentos_pendentes: currentOrcamentos
        .filter(o => o.status === 'enviado')
        .reduce((sum, o) => sum + o.valor_total, 0),
      contratos_ativos: currentContratos.filter(c => c.status === 'ativo').length,
      valor_contratos_ativos: currentContratos
        .filter(c => c.status === 'ativo')
        .reduce((sum, c) => sum + c.valor_fechado, 0),

      // Execução e financeiro
      obras_em_andamento: currentContratos.filter(c => c.status === 'ativo').length,
      margem_media_real: currentContratos.length > 0
        ? currentContratos.reduce((sum, c) => sum + c.margem_real_atual, 0) / currentContratos.length
        : 0,
      desvio_orcamentario_medio: currentContratos.length > 0
        ? currentContratos.reduce((sum, c) => {
            const orcamento = currentOrcamentos.find(o => o.id === c.id_orcamento);
            if (!orcamento) return sum;
            const desvio = ((c.custo_executado_total - (orcamento.valor_total * (c.percentual_execucao / 100))) / 
                          (orcamento.valor_total * (c.percentual_execucao / 100))) * 100;
            return sum + desvio;
          }, 0) / currentContratos.length
        : 0,
      valor_faturado_mes: currentContratos.reduce((sum, c) => sum + c.valor_faturado_total, 0),
      valor_a_faturar: currentContratos.reduce((sum, c) => sum + c.valor_pendente_faturamento, 0),

      // Indicadores de performance
      prazo_medio_aprovacao_orcamento: 8,
      tempo_medio_ciclo_comercial: currentOportunidades.length > 0
        ? currentOportunidades
            .filter(o => o.status === 'aprovada')
            .reduce((sum, o) => {
              const inicio = new Date(o.data_criacao);
              const fim = new Date(o.data_prevista_fechamento);
              return sum + Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
            }, 0) / currentOportunidades.filter(o => o.status === 'aprovada').length
        : 0,
      ticket_medio_contrato: currentContratos.length > 0
        ? currentContratos.reduce((sum, c) => sum + c.valor_fechado, 0) / currentContratos.length
        : 0
    };

    setDashboard(dashboardData);
  };

  // Funções para gerenciar leads
  const createLead = (leadData: Omit<Lead, 'id' | 'data_criacao'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      data_criacao: new Date().toISOString().split('T')[0]
    };
    
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    setStorageData('leads', updatedLeads);
    calculateDashboard();
    return newLead;
  };

  const updateLead = (id: string, leadData: Partial<Lead>) => {
    const updatedLeads = leads.map(lead => 
      lead.id === id ? { ...lead, ...leadData } : lead
    );
    setLeads(updatedLeads);
    setStorageData('leads', updatedLeads);
    calculateDashboard();
  };

  const convertLeadToOportunidade = (leadId: string, oportunidadeData: Omit<OportunidadeExpandida, 'id' | 'id_lead' | 'data_criacao' | 'historico_acoes'>) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return null;

    const newOportunidade: OportunidadeExpandida = {
      ...oportunidadeData,
      id: Date.now().toString(),
      id_lead: leadId,
      data_criacao: new Date().toISOString().split('T')[0],
      historico_acoes: [{
        id: Date.now().toString(),
        tipo: 'ligacao',
        descricao: `Conversão de lead: ${lead.nome_cliente}`,
        data: new Date().toISOString().split('T')[0],
        responsavel: lead.responsavel_comercial,
        resultado: 'Lead convertido em oportunidade'
      }]
    };

    const updatedOportunidades = [...oportunidades, newOportunidade];
    setOportunidades(updatedOportunidades);
    setStorageData('oportunidades', updatedOportunidades);

    // Atualizar o lead
    updateLead(leadId, { 
      convertido_oportunidade: true, 
      id_oportunidade: newOportunidade.id 
    });

    return newOportunidade;
  };

  // Funções para gerenciar orçamentos
  const createOrcamento = (orcamentoData: Omit<OrcamentoIntegrado, 'id' | 'data_criacao'>) => {
    const newOrcamento: OrcamentoIntegrado = {
      ...orcamentoData,
      id: Date.now().toString(),
      data_criacao: new Date().toISOString().split('T')[0]
    };
    
    const updatedOrcamentos = [...orcamentos, newOrcamento];
    setOrcamentos(updatedOrcamentos);
    setStorageData('orcamentos', updatedOrcamentos);
    calculateDashboard();
    return newOrcamento;
  };

  const approveOrcamento = (orcamentoId: string) => {
    const updatedOrcamentos = orcamentos.map(orcamento =>
      orcamento.id === orcamentoId
        ? { 
            ...orcamento, 
            status: 'aprovado' as const,
            aprovado_comercial: true,
            aprovado_tecnico: true,
            data_aprovacao: new Date().toISOString().split('T')[0]
          }
        : orcamento
    );
    setOrcamentos(updatedOrcamentos);
    setStorageData('orcamentos', updatedOrcamentos);
    calculateDashboard();
  };

  // Funções para gerenciar contratos
  const createContrato = (orcamentoId: string, contratoData: Partial<ContratoIntegrado>) => {
    const orcamento = orcamentos.find(o => o.id === orcamentoId);
    if (!orcamento) return null;

    const newContrato: ContratoIntegrado = {
      id: Date.now().toString(),
      id_orcamento: orcamentoId,
      id_cliente: orcamento.id_cliente,
      nome_cliente: orcamento.nome_cliente,
      nome_projeto: orcamento.nome_projeto,
      endereco_execucao: orcamento.endereco_execucao,
      data_assinatura: new Date().toISOString().split('T')[0],
      prazo_execucao: orcamento.prazo_execucao_dias,
      valor_fechado: orcamento.valor_total,
      tipo_execucao: 'escopo',
      status: 'ativo',
      hh_executado_total: 0,
      custo_executado_total: 0,
      margem_real_atual: orcamento.margem_lucro_prevista,
      percentual_execucao: 0,
      valor_faturado_total: 0,
      valor_pendente_faturamento: 0,
      status_financeiro: 'em_dia',
      ...contratoData
    };

    const updatedContratos = [...contratos, newContrato];
    setContratos(updatedContratos);
    setStorageData('contratos', updatedContratos);

    // Atualizar orçamento
    const updatedOrcamentos = orcamentos.map(o =>
      o.id === orcamentoId
        ? { ...o, virou_contrato: true, id_contrato: newContrato.id }
        : o
    );
    setOrcamentos(updatedOrcamentos);
    setStorageData('orcamentos', updatedOrcamentos);

    calculateDashboard();
    return newContrato;
  };

  // Função para buscar dados relacionados
  const getRelatedData = (entityId: string, entityType: 'lead' | 'oportunidade' | 'orcamento' | 'contrato') => {
    switch (entityType) {
      case 'lead':
        const lead = leads.find(l => l.id === entityId);
        const oportunidadeLead = oportunidades.find(o => o.id_lead === entityId);
        return { lead, oportunidade: oportunidadeLead };
      
      case 'oportunidade':
        const oportunidade = oportunidades.find(o => o.id === entityId);
        const orcamentoOp = orcamentos.find(ot => ot.id_oportunidade === entityId);
        return { oportunidade, orcamento: orcamentoOp };
      
      case 'orcamento':
        const orcamento = orcamentos.find(o => o.id === entityId);
        const contratoOr = contratos.find(c => c.id_orcamento === entityId);
        return { orcamento, contrato: contratoOr };
      
      case 'contrato':
        const contrato = contratos.find(c => c.id === entityId);
        const orcamentoContrato = orcamentos.find(o => o.id === contrato?.id_orcamento);
        return { contrato, orcamento: orcamentoContrato };
      
      default:
        return {};
    }
  };

  return {
    // Estados
    leads,
    clientes,
    oportunidades,
    orcamentos,
    contratos,
    dashboard,
    loading,
    
    // Funções
    loadData,
    createLead,
    updateLead,
    convertLeadToOportunidade,
    createOrcamento,
    approveOrcamento,
    createContrato,
    getRelatedData,
    calculateDashboard
  };
};