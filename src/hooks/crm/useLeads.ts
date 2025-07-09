import { useState, useCallback } from 'react';
import { Lead } from '@/types';
import { getStorageData, setStorageData } from '@/services/mockData';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadLeads = useCallback(() => {
    setLeads(getStorageData('leads', []));
  }, []);

  const createLead = useCallback((leadData: Omit<Lead, 'id' | 'data_criacao'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      data_criacao: new Date().toISOString().split('T')[0]
    };
    
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    setStorageData('leads', updatedLeads);
    return newLead;
  }, [leads]);

  const updateLead = useCallback((id: string, leadData: Partial<Lead>) => {
    const updatedLeads = leads.map(lead => 
      lead.id === id ? { ...lead, ...leadData } : lead
    );
    setLeads(updatedLeads);
    setStorageData('leads', updatedLeads);
  }, [leads]);

  return {
    leads,
    loadLeads,
    createLead,
    updateLead
  };
};