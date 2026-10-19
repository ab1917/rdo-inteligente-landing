import { OrcamentoIntegrado } from '@/types';
import { useCommercialData } from '../useCommercialData';
export const useOrcamentos = () => {
 const { orcamentos, mutate, reload } = useCommercialData();
 const createOrcamento = async (data:Omit<OrcamentoIntegrado,'id'|'data_criacao'>) => { const result=await mutate<{document:OrcamentoIntegrado}>({action:'save',entity:'orcamentos',id:crypto.randomUUID(),document:{...data,data_criacao:new Date().toISOString().slice(0,10)}});return result.document; };
 const updateOrcamento = async (id:string,data:Partial<OrcamentoIntegrado>) => { const current=orcamentos.find(v=>v.id===id);if(!current)throw new Error('Orçamento não encontrado.');return mutate({action:'save',entity:'orcamentos',id,document:{...current,...data}}); };
 const approveOrcamento = (id:string) => updateOrcamento(id,{status:'aprovado',aprovado_comercial:true,aprovado_tecnico:true});
 return { orcamentos, loadOrcamentos:reload, createOrcamento, updateOrcamento, approveOrcamento };
};
