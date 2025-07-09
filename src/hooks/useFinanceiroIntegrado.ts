import { useState, useEffect } from 'react';
import { ContratoIntegrado, BoletimMedicao, RDO } from '@/types';
import { getStorageData } from '@/services/mockData';

interface AnaliseFinanceira {
  contrato_id: string;
  nome_projeto: string;
  valor_contrato: number;
  custo_executado: number;
  margem_atual: number;
  margem_prevista: number;
  desvio_margem: number;
  percentual_execucao: number;
  valor_faturado: number;
  valor_a_faturar: number;
  projecao_resultado_final: number;
  status_financeiro: 'positivo' | 'atencao' | 'critico';
}

interface ConsolidadoFinanceiro {
  total_contratos_ativos: number;
  valor_total_contratos: number;
  custo_total_executado: number;
  margem_total_atual: number;
  valor_total_faturado: number;
  valor_total_a_faturar: number;
  analises_por_contrato: AnaliseFinanceira[];
  resumo_por_cliente: {
    cliente_id: string;
    nome_cliente: string;
    valor_total: number;
    margem_media: number;
    contratos_ativos: number;
  }[];
}

export const useFinanceiroIntegrado = () => {
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
    calculateConsolidado();
  }, []);

  const calculateConsolidado = async () => {
    setLoading(true);
    try {
      const contratos = getStorageData<ContratoIntegrado[]>('contratos', []);
      const boletins = getStorageData<BoletimMedicao[]>('boletins', []);
      const rdos = getStorageData<RDO[]>('rdos', []);

      // Calcular análise por contrato
      const analisesPorContrato: AnaliseFinanceira[] = contratos
        .filter(c => c.status === 'ativo')
        .map(contrato => {
          // Buscar boletins relacionados ao contrato
          const boletinsContrato = boletins.filter(b => {
            // Buscar RDOs que pertencem a este contrato
            const rdosBoletim = b.rdo_id.split(',').map(id => id.trim());
            return rdosBoletim.some(rdoId => {
              const rdo = rdos.find(r => r.id === rdoId);
              return rdo && rdo.obra === contrato.nome_projeto;
            });
          });

          // Calcular custos reais dos boletins
          const custoRealBoletins = boletinsContrato.reduce((total, boletim) => 
            total + boletim.resumo_financeiro.total_geral, 0
          );

          // Usar custo do contrato ou dos boletins (o que for maior)
          const custoExecutado = Math.max(contrato.custo_executado_total, custoRealBoletins);
          
          // Calcular margem atual
          const margemAtual = contrato.valor_fechado > 0 
            ? ((contrato.valor_fechado - custoExecutado) / contrato.valor_fechado) * 100
            : 0;

          // Calcular desvio de margem
          const orcamentos = getStorageData('orcamentos', []);
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
    loading,
    calculateConsolidado,
    getAnaliseContrato,
    getResumoCliente,
    getIndicadoresGlobais
  };
};