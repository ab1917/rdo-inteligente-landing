import { OportunidadeExpandida } from '@/types';
import { useCommercialData } from '../useCommercialData';
export const useOportunidades = () => {
 const { oportunidades, mutate, reload } = useCommercialData();
 const createOportunidade = async (data: Omit<OportunidadeExpandida,'id'|'data_criacao'|'historico_acoes'>) => { const result=await mutate<{document:OportunidadeExpandida}>({action:'save',entity:'oportunidades',id:crypto.randomUUID(),document:{...data,data_criacao:new Date().toISOString().slice(0,10),historico_acoes:[]}});return result.document; };
 const updateOportunidade = async (id:string,data:Partial<OportunidadeExpandida>) => { const current=oportunidades.find(v=>v.id===id);if(!current) throw new Error('Oportunidade não encontrada.');return mutate({action:'save',entity:'oportunidades',id,document:{...current,...data}}); };
 const convertLeadToOportunidade = (leadId:string,data:Omit<OportunidadeExpandida,'id'|'id_lead'|'data_criacao'|'historico_acoes'>) => createOportunidade({...data,id_lead:leadId});
 return { oportunidades, loadOportunidades:reload, createOportunidade, updateOportunidade, convertLeadToOportunidade };
};
