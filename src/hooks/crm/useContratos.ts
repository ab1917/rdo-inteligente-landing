import { ContratoIntegrado } from '@/types';
import { useCommercialData } from '../useCommercialData';
export const useContratos = () => {
 const { contratos, orcamentos, mutate, reload } = useCommercialData();
 const createContrato = async (orcamentoId:string,data:Partial<ContratoIntegrado>) => {
  const budget=orcamentos.find(v=>v.id===orcamentoId);if(!budget)throw new Error('Orçamento não encontrado.');
  const result=await mutate<{document:ContratoIntegrado}>({action:'save',entity:'contratos',id:crypto.randomUUID(),document:{id_orcamento:budget.id,id_cliente:budget.id_cliente,nome_cliente:budget.nome_cliente,nome_projeto:budget.nome_projeto,endereco_execucao:budget.endereco_execucao,data_assinatura:new Date().toISOString().slice(0,10),prazo_execucao:budget.prazo_execucao_dias,valor_fechado:budget.valor_total,tipo_execucao:'escopo',status:'ativo',hh_executado_total:0,custo_executado_total:0,margem_real_atual:budget.margem_lucro_prevista,percentual_execucao:0,valor_faturado_total:0,valor_pendente_faturamento:0,status_financeiro:'em_dia',...data}});return result.document;
 };
 const updateContrato = async (id:string,data:Partial<ContratoIntegrado>) => { const current=contratos.find(v=>v.id===id);if(!current)throw new Error('Contrato não encontrado.');return mutate({action:'save',entity:'contratos',id,document:{...current,...data}}); };
 return { contratos, loadContratos:reload, createContrato, updateContrato };
};
