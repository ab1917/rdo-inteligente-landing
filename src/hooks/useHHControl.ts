import { useState, useEffect } from 'react';
import { RDO, Funcionario, Atividade } from '@/types';
import { getStorageData } from '@/services/mockData';

interface HHValidation {
  funcionario_certificado: boolean;
  hh_dentro_limite: boolean;
  custo_dentro_orcamento: boolean;
  equipamento_disponivel: boolean;
  alertas: string[];
}

interface HHControlData {
  hh_executado_total: number;
  hh_previsto_dia: number;
  desvio_produtividade: number;
  custo_hh_realizado: number;
  validacao: HHValidation;
}

export const useHHControl = (rdoId?: string) => {
  const [hhData, setHHData] = useState<HHControlData>({
    hh_executado_total: 0,
    hh_previsto_dia: 8,
    desvio_produtividade: 0,
    custo_hh_realizado: 0,
    validacao: {
      funcionario_certificado: false,
      hh_dentro_limite: false,
      custo_dentro_orcamento: false,
      equipamento_disponivel: false,
      alertas: []
    }
  });

  const calcularHHExecutado = (atividades: Atividade[], equipes: any[]): number => {
    return equipes.reduce((total, equipe) => {
      return total + equipe.horasTrabalhadas;
    }, 0);
  };

  const calcularCustoHH = (funcionarios: string[], horas: number): number => {
    const funcionariosData = getStorageData<Funcionario[]>('funcionarios', []);
    const custoMedio = funcionarios.reduce((total, nome) => {
      const funcionario = funcionariosData.find(f => f.nome === nome);
      return total + (funcionario?.valor_hora || 50);
    }, 0) / funcionarios.length;
    
    return custoMedio * horas;
  };

  const validarCertificacoes = (funcionarios: string[], atividades: Atividade[]): boolean => {
    const funcionariosData = getStorageData<Funcionario[]>('funcionarios', []);
    
    return funcionarios.every(nome => {
      const funcionario = funcionariosData.find(f => f.nome === nome);
      if (!funcionario?.certificacoes) return false;
      
      // Verificar se possui certificações válidas para o tipo de atividade
      const temCertificacaoValida = funcionario.certificacoes.some(cert => 
        cert.status === 'valida' && new Date(cert.data_vencimento || '') > new Date()
      );
      
      return temCertificacaoValida;
    });
  };

  const atualizarHHControl = (rdo: RDO) => {
    const hhExecutado = calcularHHExecutado(rdo.atividades, rdo.equipes);
    const funcionarios = rdo.equipes.map(e => e.funcionario);
    const custoRealizado = calcularCustoHH(funcionarios, hhExecutado);
    const desvio = (hhExecutado - rdo.hh_previsto_dia) / rdo.hh_previsto_dia;
    
    const funcionariosCertificados = validarCertificacoes(funcionarios, rdo.atividades);
    const hhDentroLimite = hhExecutado <= 12; // Máximo 12h por dia
    const custoDentroOrcamento = Math.abs(desvio) <= 0.15; // 15% de tolerância
    
    const alertas: string[] = [];
    if (!funcionariosCertificados) alertas.push('Funcionários sem certificações válidas');
    if (!hhDentroLimite) alertas.push('Horas executadas excedem limite diário');
    if (!custoDentroOrcamento) alertas.push('Desvio de custo acima da tolerância');
    if (Math.abs(desvio) > 0.25) alertas.push('Produtividade muito abaixo do esperado');

    setHHData({
      hh_executado_total: hhExecutado,
      hh_previsto_dia: rdo.hh_previsto_dia,
      desvio_produtividade: desvio,
      custo_hh_realizado: custoRealizado,
      validacao: {
        funcionario_certificado: funcionariosCertificados,
        hh_dentro_limite: hhDentroLimite,
        custo_dentro_orcamento: custoDentroOrcamento,
        equipamento_disponivel: true, // TODO: implementar validação de equipamentos
        alertas
      }
    });
  };

  const gerarRelatorioProdutividade = () => {
    return {
      eficiencia: hhData.hh_previsto_dia > 0 ? 
        (hhData.hh_executado_total / hhData.hh_previsto_dia) * 100 : 0,
      custo_por_hora: hhData.hh_executado_total > 0 ? 
        hhData.custo_hh_realizado / hhData.hh_executado_total : 0,
      status_geral: hhData.validacao.alertas.length === 0 ? 'conforme' : 'com_alertas',
      recomendacoes: gerarRecomendacoes()
    };
  };

  const gerarRecomendacoes = (): string[] => {
    const recomendacoes: string[] = [];
    
    if (hhData.desvio_produtividade < -0.15) {
      recomendacoes.push('Considere revisar planejamento ou adicionar recursos');
    }
    
    if (hhData.desvio_produtividade > 0.15) {
      recomendacoes.push('Ótima produtividade! Considere otimizar cronograma');
    }
    
    if (hhData.validacao.alertas.length > 0) {
      recomendacoes.push('Regularize certificações e conformidades');
    }
    
    return recomendacoes;
  };

  return {
    hhData,
    atualizarHHControl,
    gerarRelatorioProdutividade,
    calcularHHExecutado,
    calcularCustoHH,
    validarCertificacoes
  };
};