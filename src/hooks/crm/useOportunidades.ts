import { useState, useCallback } from 'react';
import { OportunidadeExpandida } from '@/types';
import { getStorageData, setStorageData } from '@/services/mockData';

export const useOportunidades = () => {
  const [oportunidades, setOportunidades] = useState<OportunidadeExpandida[]>([]);

  const loadOportunidades = useCallback(() => {
    setOportunidades(getStorageData('oportunidades', []));
  }, []);

  const createOportunidade = useCallback((oportunidadeData: Omit<OportunidadeExpandida, 'id' | 'data_criacao' | 'historico_acoes'>) => {
    const newOportunidade: OportunidadeExpandida = {
      ...oportunidadeData,
      id: Date.now().toString(),
      data_criacao: new Date().toISOString().split('T')[0],
      historico_acoes: []
    };
    
    const updatedOportunidades = [...oportunidades, newOportunidade];
    setOportunidades(updatedOportunidades);
    setStorageData('oportunidades', updatedOportunidades);
    return newOportunidade;
  }, [oportunidades]);

  const updateOportunidade = useCallback((id: string, oportunidadeData: Partial<OportunidadeExpandida>) => {
    const updatedOportunidades = oportunidades.map(oportunidade => 
      oportunidade.id === id ? { ...oportunidade, ...oportunidadeData } : oportunidade
    );
    setOportunidades(updatedOportunidades);
    setStorageData('oportunidades', updatedOportunidades);
  }, [oportunidades]);

  const convertLeadToOportunidade = useCallback((leadId: string, oportunidadeData: Omit<OportunidadeExpandida, 'id' | 'id_lead' | 'data_criacao' | 'historico_acoes'>) => {
    const newOportunidade: OportunidadeExpandida = {
      ...oportunidadeData,
      id: Date.now().toString(),
      id_lead: leadId,
      data_criacao: new Date().toISOString().split('T')[0],
      historico_acoes: [{
        id: Date.now().toString(),
        tipo: 'ligacao',
        descricao: `Conversão de lead para oportunidade`,
        data: new Date().toISOString().split('T')[0],
        responsavel: oportunidadeData.responsavel_comercial,
        resultado: 'Lead convertido em oportunidade'
      }]
    };

    const updatedOportunidades = [...oportunidades, newOportunidade];
    setOportunidades(updatedOportunidades);
    setStorageData('oportunidades', updatedOportunidades);
    return newOportunidade;
  }, [oportunidades]);

  return {
    oportunidades,
    loadOportunidades,
    createOportunidade,
    updateOportunidade,
    convertLeadToOportunidade
  };
};