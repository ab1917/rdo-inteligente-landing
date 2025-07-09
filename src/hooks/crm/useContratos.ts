import { useState, useCallback } from 'react';
import { ContratoIntegrado, OrcamentoIntegrado } from '@/types';
import { getStorageData, setStorageData } from '@/services/mockData';

export const useContratos = () => {
  const [contratos, setContratos] = useState<ContratoIntegrado[]>([]);

  const loadContratos = useCallback(() => {
    setContratos(getStorageData('contratos', []));
  }, []);

  const createContrato = useCallback((orcamentoId: string, contratoData: Partial<ContratoIntegrado>) => {
    const orcamentos = getStorageData<OrcamentoIntegrado[]>('orcamentos', []);
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
    setStorageData('orcamentos', updatedOrcamentos);

    return newContrato;
  }, [contratos]);

  const updateContrato = useCallback((id: string, contratoData: Partial<ContratoIntegrado>) => {
    const updatedContratos = contratos.map(contrato => 
      contrato.id === id ? { ...contrato, ...contratoData } : contrato
    );
    setContratos(updatedContratos);
    setStorageData('contratos', updatedContratos);
  }, [contratos]);

  return {
    contratos,
    loadContratos,
    createContrato,
    updateContrato
  };
};