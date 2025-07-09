import { useState, useCallback } from 'react';
import { OrcamentoIntegrado } from '@/types';
import { getStorageData, setStorageData } from '@/services/mockData';

export const useOrcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<OrcamentoIntegrado[]>([]);

  const loadOrcamentos = useCallback(() => {
    setOrcamentos(getStorageData('orcamentos', []));
  }, []);

  const createOrcamento = useCallback((orcamentoData: Omit<OrcamentoIntegrado, 'id' | 'data_criacao'>) => {
    const newOrcamento: OrcamentoIntegrado = {
      ...orcamentoData,
      id: Date.now().toString(),
      data_criacao: new Date().toISOString().split('T')[0]
    };
    
    const updatedOrcamentos = [...orcamentos, newOrcamento];
    setOrcamentos(updatedOrcamentos);
    setStorageData('orcamentos', updatedOrcamentos);
    return newOrcamento;
  }, [orcamentos]);

  const updateOrcamento = useCallback((id: string, orcamentoData: Partial<OrcamentoIntegrado>) => {
    const updatedOrcamentos = orcamentos.map(orcamento => 
      orcamento.id === id ? { ...orcamento, ...orcamentoData } : orcamento
    );
    setOrcamentos(updatedOrcamentos);
    setStorageData('orcamentos', updatedOrcamentos);
  }, [orcamentos]);

  const approveOrcamento = useCallback((orcamentoId: string) => {
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
  }, [orcamentos]);

  return {
    orcamentos,
    loadOrcamentos,
    createOrcamento,
    updateOrcamento,
    approveOrcamento
  };
};