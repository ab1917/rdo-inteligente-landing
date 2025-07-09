import { useState, useEffect } from 'react';
import { RDO, Funcionario } from '@/types';
import { getStorageData } from '@/services/mockData';

interface ProductivityMetrics {
  eficiencia_geral: number;
  custo_medio_hh: number;
  horas_totais: number;
  desvio_cronograma: number;
  funcionarios_mais_produtivos: FuncionarioMetric[];
  alertas_produtividade: string[];
}

interface FuncionarioMetric {
  nome: string;
  cargo: string;
  horas_trabalhadas: number;
  eficiencia: number;
  custo_total: number;
  valor_hora: number;
}

interface PeriodFilter {
  inicio: string;
  fim: string;
  obra?: string;
  funcionario?: string;
}

export const useProductivityAnalysis = (filtros?: PeriodFilter) => {
  const [metrics, setMetrics] = useState<ProductivityMetrics>({
    eficiencia_geral: 0,
    custo_medio_hh: 0,
    horas_totais: 0,
    desvio_cronograma: 0,
    funcionarios_mais_produtivos: [],
    alertas_produtividade: []
  });
  const [loading, setLoading] = useState(false);

  const calcularMetricas = () => {
    setLoading(true);
    
    try {
      const rdos = getStorageData<RDO[]>('rdos', []);
      const funcionarios = getStorageData<Funcionario[]>('funcionarios', []);
      
      // Filtrar RDOs baseado nos filtros
      let rdosFiltrados = rdos;
      if (filtros) {
        rdosFiltrados = rdos.filter(rdo => {
          const dataRdo = new Date(rdo.data);
          const dataInicio = new Date(filtros.inicio);
          const dataFim = new Date(filtros.fim);
          
          let dentroRangeData = dataRdo >= dataInicio && dataRdo <= dataFim;
          let dentroObra = !filtros.obra || rdo.obra === filtros.obra;
          let dentroFuncionario = !filtros.funcionario || 
            rdo.equipes.some(e => e.funcionario === filtros.funcionario);
          
          return dentroRangeData && dentroObra && dentroFuncionario;
        });
      }

      // Calcular métricas
      const horasTotais = rdosFiltrados.reduce((total, rdo) => total + rdo.hh_executado_total, 0);
      const horasPrevistoTotal = rdosFiltrados.reduce((total, rdo) => total + rdo.hh_previsto_dia, 0);
      const custoTotal = rdosFiltrados.reduce((total, rdo) => total + rdo.custo_hh_realizado, 0);
      
      const eficienciaGeral = horasPrevistoTotal > 0 ? 
        (horasTotais / horasPrevistoTotal) * 100 : 0;
      
      const custoMedioHH = horasTotais > 0 ? custoTotal / horasTotais : 0;
      
      const desvioMedio = rdosFiltrados.length > 0 ?
        rdosFiltrados.reduce((sum, rdo) => sum + rdo.desvio_produtividade, 0) / rdosFiltrados.length : 0;

      // Análise por funcionário
      const funcionarioStats = new Map<string, FuncionarioMetric>();
      
      rdosFiltrados.forEach(rdo => {
        rdo.equipes.forEach(membro => {
          const funcionario = funcionarios.find(f => f.nome === membro.funcionario);
          const valorHora = funcionario?.valor_hora || 50;
          
          if (funcionarioStats.has(membro.funcionario)) {
            const stats = funcionarioStats.get(membro.funcionario)!;
            stats.horas_trabalhadas += membro.horasTrabalhadas;
            stats.custo_total += membro.horasTrabalhadas * valorHora;
          } else {
            funcionarioStats.set(membro.funcionario, {
              nome: membro.funcionario,
              cargo: membro.cargo,
              horas_trabalhadas: membro.horasTrabalhadas,
              eficiencia: 0, // Calculado depois
              custo_total: membro.horasTrabalhadas * valorHora,
              valor_hora: valorHora
            });
          }
        });
      });

      // Calcular eficiência por funcionário e ordenar
      const funcionariosList = Array.from(funcionarioStats.values()).map(stats => {
        // Eficiência baseada na relação horas/valor produzido
        stats.eficiencia = stats.horas_trabalhadas > 0 ? 
          (stats.horas_trabalhadas * 8) / stats.horas_trabalhadas * 100 : 0;
        return stats;
      }).sort((a, b) => b.eficiencia - a.eficiencia);

      // Gerar alertas
      const alertas: string[] = [];
      if (eficienciaGeral < 70) {
        alertas.push('Eficiência geral abaixo do esperado (< 70%)');
      }
      if (desvioMedio < -0.2) {
        alertas.push('Cronograma significativamente atrasado');
      }
      if (custoMedioHH > 80) {
        alertas.push('Custo por hora acima da média do mercado');
      }
      if (funcionariosList.some(f => f.horas_trabalhadas > 60)) {
        alertas.push('Funcionários com excesso de horas trabalhadas');
      }

      setMetrics({
        eficiencia_geral: eficienciaGeral,
        custo_medio_hh: custoMedioHH,
        horas_totais: horasTotais,
        desvio_cronograma: desvioMedio,
        funcionarios_mais_produtivos: funcionariosList.slice(0, 5),
        alertas_produtividade: alertas
      });

    } catch (error) {
      console.error('Erro ao calcular métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorioComparativo = (periodoAnterior: PeriodFilter) => {
    // Implementar comparação com período anterior
    return {
      variacao_eficiencia: 0,
      variacao_custo: 0,
      variacao_horas: 0,
      tendencia: 'estavel' as 'melhora' | 'piora' | 'estavel'
    };
  };

  const exportarRelatorio = () => {
    const dados = {
      periodo: filtros,
      metricas: metrics,
      gerado_em: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-produtividade-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    calcularMetricas();
  }, [filtros]);

  return {
    metrics,
    loading,
    calcularMetricas,
    gerarRelatorioComparativo,
    exportarRelatorio
  };
};