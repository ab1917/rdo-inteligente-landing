import { Lead, OportunidadeExpandida, OrcamentoIntegrado, ContratoIntegrado, DashboardIntegrado } from '@/types';

export const calculateDashboard = (
  leads: Lead[],
  oportunidades: OportunidadeExpandida[],
  orcamentos: OrcamentoIntegrado[],
  contratos: ContratoIntegrado[]
): DashboardIntegrado => {
  return {
    // Métricas CRM
    leads_ativos: leads.filter(l => l.status !== 'desqualificado').length,
    leads_mes: leads.filter(l => {
      const dataContato = new Date(l.data_contato);
      const mesAtual = new Date();
      return dataContato.getMonth() === mesAtual.getMonth() && 
             dataContato.getFullYear() === mesAtual.getFullYear();
    }).length,
    taxa_conversao_lead_oportunidade: leads.length > 0 
      ? (leads.filter(l => l.convertido_oportunidade).length / leads.length) * 100 
      : 0,

    // Pipeline comercial
    oportunidades_ativas: oportunidades.filter(o => o.status !== 'perdida').length,
    valor_pipeline_total: oportunidades
      .filter(o => o.status !== 'perdida')
      .reduce((sum, o) => sum + o.valor_estimado, 0),
    valor_pipeline_mes: oportunidades
      .filter(o => {
        const dataCriacao = new Date(o.data_criacao);
        const mesAtual = new Date();
        return dataCriacao.getMonth() === mesAtual.getMonth() && 
               dataCriacao.getFullYear() === mesAtual.getFullYear();
      })
      .reduce((sum, o) => sum + o.valor_estimado, 0),
    probabilidade_media_fechamento: oportunidades.length > 0
      ? oportunidades.reduce((sum, o) => sum + o.probabilidade_fechamento, 0) / oportunidades.length
      : 0,

    // Orçamentos e contratos
    orcamentos_pendentes: orcamentos.filter(o => o.status === 'enviado').length,
    valor_orcamentos_pendentes: orcamentos
      .filter(o => o.status === 'enviado')
      .reduce((sum, o) => sum + o.valor_total, 0),
    contratos_ativos: contratos.filter(c => c.status === 'ativo').length,
    valor_contratos_ativos: contratos
      .filter(c => c.status === 'ativo')
      .reduce((sum, c) => sum + c.valor_fechado, 0),

    // Execução e financeiro
    obras_em_andamento: contratos.filter(c => c.status === 'ativo').length,
    margem_media_real: contratos.length > 0
      ? contratos.reduce((sum, c) => sum + c.margem_real_atual, 0) / contratos.length
      : 0,
    desvio_orcamentario_medio: contratos.length > 0
      ? contratos.reduce((sum, c) => {
          const orcamento = orcamentos.find(o => o.id === c.id_orcamento);
          if (!orcamento) return sum;
          const desvio = ((c.custo_executado_total - (orcamento.valor_total * (c.percentual_execucao / 100))) / 
                        (orcamento.valor_total * (c.percentual_execucao / 100))) * 100;
          return sum + desvio;
        }, 0) / contratos.length
      : 0,
    valor_faturado_mes: contratos.reduce((sum, c) => sum + c.valor_faturado_total, 0),
    valor_a_faturar: contratos.reduce((sum, c) => sum + c.valor_pendente_faturamento, 0),

    // Indicadores de performance
    prazo_medio_aprovacao_orcamento: 8,
    tempo_medio_ciclo_comercial: oportunidades.length > 0
      ? oportunidades
          .filter(o => o.status === 'aprovada')
          .reduce((sum, o) => {
            const inicio = new Date(o.data_criacao);
            const fim = new Date(o.data_prevista_fechamento);
            return sum + Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / oportunidades.filter(o => o.status === 'aprovada').length
      : 0,
    ticket_medio_contrato: contratos.length > 0
      ? contratos.reduce((sum, c) => sum + c.valor_fechado, 0) / contratos.length
      : 0
  };
};