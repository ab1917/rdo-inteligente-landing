import { useState, useEffect } from 'react';
import { RDO, Orcamento } from '@/types';

interface AnaliseOrcamentoRDO {
  variacao_hh: number;
  variacao_custo: number;
  eficiencia_geral: number;
  status_orcamento: 'ok' | 'warning' | 'danger';
  status_prazo: 'ok' | 'warning' | 'danger';
  status_produtividade: 'ok' | 'warning' | 'danger';
  acoes_recomendadas: string[];
}

interface RelatorioAvanco {
  avanco_fisico: number;
  avanco_financeiro: number;
  avanco_cronograma: number;
  previsao_conclusao: string;
  custo_projetado: number;
  desvio_orcamentario: number;
}

interface AlertaIntegracao {
  tipo: 'warning' | 'danger';
  categoria: string;
  mensagem: string;
  acao_sugerida?: string;
}

export const useOrcamentoRDO = (rdo: RDO, orcamento?: Orcamento) => {
  const [analise, setAnalise] = useState<AnaliseOrcamentoRDO>({
    variacao_hh: 0,
    variacao_custo: 0,
    eficiencia_geral: 100,
    status_orcamento: 'ok',
    status_prazo: 'ok',
    status_produtividade: 'ok',
    acoes_recomendadas: []
  });

  const [relatorioAvanco, setRelatorioAvanco] = useState<RelatorioAvanco>({
    avanco_fisico: 0,
    avanco_financeiro: 0,
    avanco_cronograma: 0,
    previsao_conclusao: '',
    custo_projetado: 0,
    desvio_orcamentario: 0
  });

  const [alertas, setAlertas] = useState<AlertaIntegracao[]>([]);

  useEffect(() => {
    if (!orcamento) return;

    // Calcular variações
    const variacaoHH = ((rdo.hh_executado_total - rdo.hh_previsto_dia) / rdo.hh_previsto_dia) * 100;
    const custoOrcado = orcamento.valor_hh_medio * rdo.hh_previsto_dia;
    const custoReal = rdo.custo_hh_realizado * rdo.hh_executado_total;
    const variacaoCusto = ((custoReal - custoOrcado) / custoOrcado) * 100;

    // Calcular eficiência geral
    const eficienciaHH = rdo.hh_previsto_dia / rdo.hh_executado_total * 100;
    const eficienciaCusto = custoOrcado / custoReal * 100;
    const eficienciaGeral = (eficienciaHH + eficienciaCusto) / 2;

    // Determinar status
    const statusOrcamento = variacaoCusto > 15 ? 'danger' : variacaoCusto > 5 ? 'warning' : 'ok';
    const statusProdutividade = eficienciaGeral < 70 ? 'danger' : eficienciaGeral < 85 ? 'warning' : 'ok';
    const statusPrazo = variacaoHH > 20 ? 'danger' : variacaoHH > 10 ? 'warning' : 'ok';

    // Gerar ações recomendadas
    const acoesRecomendadas: string[] = [];
    if (variacaoHH > 15) {
      acoesRecomendadas.push('Revisar alocação de equipe - produtividade abaixo do esperado');
    }
    if (variacaoCusto > 10) {
      acoesRecomendadas.push('Analisar custos de HH - valores acima do orçado');
    }
    if (eficienciaGeral < 80) {
      acoesRecomendadas.push('Implementar treinamento adicional para a equipe');
    }

    setAnalise({
      variacao_hh: variacaoHH,
      variacao_custo: variacaoCusto,
      eficiencia_geral: eficienciaGeral,
      status_orcamento: statusOrcamento,
      status_prazo: statusPrazo,
      status_produtividade: statusProdutividade,
      acoes_recomendadas: acoesRecomendadas
    });

    // Calcular avanço
    const diasDecorridos = Math.floor((new Date().getTime() - new Date(rdo.data).getTime()) / (1000 * 60 * 60 * 24));
    const prazoTotal = 30; // assumindo 30 dias como padrão
    const avancoCronograma = Math.min((diasDecorridos / prazoTotal) * 100, 100);
    
    const hhTotalExecutado = rdo.hh_executado_total;
    const hhTotalPrevisto = orcamento.hh_previsto_total;
    const avancoFisico = Math.min((hhTotalExecutado / hhTotalPrevisto) * 100, 100);
    
    const custoTotalExecutado = rdo.custo_hh_realizado * hhTotalExecutado;
    const avancoFinanceiro = Math.min((custoTotalExecutado / orcamento.valor_total) * 100, 100);

    // Projeções
    const ritmoAtual = avancoFisico / avancoCronograma;
    const diasRestantes = Math.round((100 - avancoFisico) / (avancoFisico / diasDecorridos));
    const previsaoConclusao = new Date(Date.now() + diasRestantes * 24 * 60 * 60 * 1000);
    
    const custoProjetado = (custoTotalExecutado / avancoFinanceiro) * 100;
    const desvioOrcamentario = ((custoProjetado - orcamento.valor_total) / orcamento.valor_total) * 100;

    setRelatorioAvanco({
      avanco_fisico: avancoFisico,
      avanco_financeiro: avancoFinanceiro,
      avanco_cronograma: avancoCronograma,
      previsao_conclusao: previsaoConclusao.toLocaleDateString('pt-BR'),
      custo_projetado: custoProjetado,
      desvio_orcamentario: desvioOrcamentario
    });

    // Gerar alertas
    const novosAlertas: AlertaIntegracao[] = [];
    
    if (variacaoHH > 20) {
      novosAlertas.push({
        tipo: 'danger',
        categoria: 'Produtividade',
        mensagem: `HH executado ${variacaoHH.toFixed(1)}% acima do previsto`,
        acao_sugerida: 'Revisar cronograma e equipe'
      });
    }

    if (variacaoCusto > 15) {
      novosAlertas.push({
        tipo: 'danger',
        categoria: 'Orçamento',
        mensagem: `Custo ${variacaoCusto.toFixed(1)}% acima do orçado`,
        acao_sugerida: 'Controlar custos imediatamente'
      });
    }

    if (avancoFisico < avancoCronograma - 10) {
      novosAlertas.push({
        tipo: 'warning',
        categoria: 'Cronograma',
        mensagem: 'Execução física atrasada em relação ao cronograma',
        acao_sugerida: 'Acelerar ritmo de trabalho'
      });
    }

    // Validações de conformidade
    if (!rdo.validacao_tecnica.funcionario_certificado) {
      novosAlertas.push({
        tipo: 'danger',
        categoria: 'Conformidade',
        mensagem: 'Funcionários sem certificação adequada',
        acao_sugerida: 'Providenciar certificações obrigatórias'
      });
    }

    if (!rdo.validacao_tecnica.equipamento_calibrado) {
      novosAlertas.push({
        tipo: 'warning',
        categoria: 'Equipamentos',
        mensagem: 'Equipamentos necessitam calibração',
        acao_sugerida: 'Agendar calibração dos equipamentos'
      });
    }

    setAlertas(novosAlertas);
  }, [rdo, orcamento]);

  const gerarRelatorioGerencial = () => {
    return {
      resumo_executivo: {
        data_relatorio: new Date().toLocaleDateString('pt-BR'),
        obra: rdo.obra,
        responsavel: rdo.responsavel,
        status_geral: analise.status_orcamento === 'ok' && analise.status_prazo === 'ok' ? 'Satisfatório' : 'Requer Atenção'
      },
      indicadores_principais: {
        eficiencia_produtividade: `${analise.eficiencia_geral.toFixed(1)}%`,
        desvio_orcamentario: `${analise.variacao_custo.toFixed(1)}%`,
        desvio_cronograma: `${analise.variacao_hh.toFixed(1)}%`,
        conformidade_tecnica: rdo.validacao_tecnica.funcionario_certificado ? 'Conforme' : 'Não Conforme'
      },
      projecoes: relatorioAvanco,
      recomendacoes: analise.acoes_recomendadas,
      alertas_criticos: alertas.filter(a => a.tipo === 'danger').length,
      alertas_atencao: alertas.filter(a => a.tipo === 'warning').length
    };
  };

  return {
    analise,
    relatorioAvanco,
    alertas,
    gerarRelatorioGerencial
  };
};