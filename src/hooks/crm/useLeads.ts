import { Lead } from '@/types';
import { useCommercialData } from '../useCommercialData';
export const useLeads = () => {
 const { leads, mutate, reload } = useCommercialData();
 const createLead = async (data: Omit<Lead, 'id' | 'data_criacao'>) => { const result=await mutate<{document:Lead}>({action:'save',entity:'leads',id:crypto.randomUUID(),document:{...data,data_criacao:new Date().toISOString().slice(0,10)}});return result.document; };
 const updateLead = async (id:string,data:Partial<Lead>) => { const current=leads.find(v=>v.id===id);if(!current) throw new Error('Lead não encontrado.');return mutate({action:'save',entity:'leads',id,document:{...current,...data}}); };
 return { leads, loadLeads:reload, createLead, updateLead };
};
