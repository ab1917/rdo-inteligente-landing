import { useState, useEffect } from 'react';
import { ContratoIntegrado, BoletimMedicao, AnaliseFinanceira, ConsolidadoFinanceiro } from '@/types';
import { useCommercialData } from './useCommercialData';
import { useBoletimMedicao } from './useBoletimMedicao';
import { deriveContractTotals } from '@/services/financeiro/contractTotals';
import { useRDO } from './useRDO';

export const useFinanceiroIntegrado = () => {
  const { rdos, loading: rdosLoading, error: rdoError } = useRDO();
  const commercial = useCommercialData();
  const { boletins, loading: boletinsLoading, error: boletinsError } = useBoletimMedicao();
  const [consolidado, setConsolidado] = useState<ConsolidadoFinanceiro>({
    total_contratos_ativos: 0,
    valor_total_contratos: 0,
    custo_total_executado: 0,
    margem_total_atual: 0,
    valor_total_faturado: 0,
    valor_total_a_faturar: 0,
    analises_por_contrato: [],
    resumo_por_cliente: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rdosLoading && !commercial.loading && !boletinsLoading) calculateConsolidado();
  }, [rdos, rdosLoading, commercial.contratos, commercial.orcamentos, commercial.loading, boletins, boletinsLoading]);

  const calculateConsolidado = async () => {
    setLoading(true);
    try {
      const contratos = deriveContractTotals(commercial.contratos, boletins, rdos);

      // Calcular análise por contrato
      const analisesPorContrato: AnaliseFinanceira[] = contratos
        .filter(c => c.status === 'ativo')
        .map(contrato => {
          // Buscar boletins relacionados ao contrato
          const custoExecutado = contrato.custo_executado_total;
          
          // Calcular margem atual
          const margemAtual = contrato.valor_fechado > 0 
            ? ((contrato.valor_fechado - custoExecutado) / contrato.valor_fechado) * 100
            : 0;

          // Calcular desvio de margem
          const orcamentos = commercial.orcamentos;
          const orcamento = orcamentos.find((o: any) => o.id === contrato.id_orcamento);
          const margemPrevista = orcamento?.margem_lucro_prevista || 0;
          const desvioMargem = margemAtual - margemPrevista;

          // Projetar resultado final
          const projecaoResultadoFinal = contrato.percentual_execucao > 0
            ? (custoExecutado / contrato.percentual_execucao) * 100
            : custoExecutado;

          // Determinar status financeiro
          let statusFinanceiro: 'positivo' | 'atencao' | 'critico' = 'positivo';
          if (desvioMargem < -5) statusFinanceiro = 'atencao';
          if (desvioMargem < -10) statusFinanceiro = 'critico';

          return {
            contrato_id: contrato.id,
            nome_projeto: contrato.nome_projeto,
            valor_contrato: contrato.valor_fechado,
            custo_executado: custoExecutado,
            margem_atual: margemAtual,
            margem_prevista: margemPrevista,
            desvio_margem: desvioMargem,
            percentual_execucao: contrato.percentual_execucao,
            valor_faturado: contrato.valor_faturado_total,
            valor_a_faturar: contrato.valor_pendente_faturamento,
            projecao_resultado_final: projecaoResultadoFinal,
            status_financeiro: statusFinanceiro
          };
        });

      // Calcular totais
      const totalContratos = analisesPorContrato.length;
      const valorTotalContratos = analisesPorContrato.reduce((sum, a) => sum + a.valor_contrato, 0);
      const custoTotalExecutado = analisesPorContrato.reduce((sum, a) => sum + a.custo_executado, 0);
      const valorTotalFaturado = analisesPorContrato.reduce((sum, a) => sum + a.valor_faturado, 0);
      const valorTotalAFaturar = analisesPorContrato.reduce((sum, a) => sum + a.valor_a_faturar, 0);
      
      const margemTotalAtual = valorTotalContratos > 0
        ? ((valorTotalContratos - custoTotalExecutado) / valorTotalContratos) * 100
        : 0;

      // Resumo por cliente
      const resumoPorCliente = contratos
        .filter(c => c.status === 'ativo')
        .reduce((acc, contrato) => {
          const existing = acc.find(r => r.cliente_id === contrato.id_cliente);
          if (existing) {
            existing.valor_total += contrato.valor_fechado;
            existing.contratos_ativos += 1;
            existing.margem_media = (existing.margem_media + contrato.margem_real_atual) / 2;
          } else {
            acc.push({
              cliente_id: contrato.id_cliente,
              nome_cliente: contrato.nome_cliente,
              valor_total: contrato.valor_fechado,
              margem_media: contrato.margem_real_atual,
              contratos_ativos: 1
            });
          }
          return acc;
        }, [] as any[]);

      setConsolidado({
        total_contratos_ativos: totalContratos,
        valor_total_contratos: valorTotalContratos,
        custo_total_executado: custoTotalExecutado,
        margem_total_atual: margemTotalAtual,
        valor_total_faturado: valorTotalFaturado,
        valor_total_a_faturar: valorTotalAFaturar,
        analises_por_contrato: analisesPorContrato,
        resumo_por_cliente: resumoPorCliente
      });
      
    } catch (error) {
      console.error('Erro ao calcular consolidado financeiro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnaliseContrato = (contratoId: string): AnaliseFinanceira | null => {
    return consolidado.analises_por_contrato.find(a => a.contrato_id === contratoId) || null;
  };

  const getResumoCliente = (clienteId: string) => {
    return consolidado.resumo_por_cliente.find(r => r.cliente_id === clienteId) || null;
  };

  const getIndicadoresGlobais = () => {
    const contratosAtivos = consolidado.analises_por_contrato;
    
    return {
      margem_media_geral: consolidado.margem_total_atual,
      contratos_no_verde: contratosAtivos.filter(a => a.status_financeiro === 'positivo').length,
      contratos_atencao: contratosAtivos.filter(a => a.status_financeiro === 'atencao').length,
      contratos_criticos: contratosAtivos.filter(a => a.status_financeiro === 'critico').length,
      percentual_faturado: consolidado.valor_total_contratos > 0
        ? (consolidado.valor_total_faturado / consolidado.valor_total_contratos) * 100
        : 0,
      receita_potencial_restante: consolidado.valor_total_a_faturar,
      economia_orcamentaria: contratosAtivos.reduce((sum, a) => {
        const economia = a.valor_contrato - a.projecao_resultado_final;
        return sum + (economia > 0 ? economia : 0);
      }, 0)
    };
  };

  return {
    consolidado,
    loading: loading || rdosLoading || commercial.loading || boletinsLoading,
    error: commercial.error || boletinsError || rdoError,
    calculateConsolidado,
    getAnaliseContrato,
    getResumoCliente,
    getIndicadoresGlobais
  };
};