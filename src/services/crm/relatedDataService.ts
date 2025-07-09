import { Lead, OportunidadeExpandida, OrcamentoIntegrado, ContratoIntegrado } from '@/types';

export const getRelatedData = (
  entityId: string, 
  entityType: 'lead' | 'oportunidade' | 'orcamento' | 'contrato',
  leads: Lead[],
  oportunidades: OportunidadeExpandida[],
  orcamentos: OrcamentoIntegrado[],
  contratos: ContratoIntegrado[]
) => {
  switch (entityType) {
    case 'lead':
      const lead = leads.find(l => l.id === entityId);
      const oportunidadeLead = oportunidades.find(o => o.id_lead === entityId);
      return { lead, oportunidade: oportunidadeLead };
    
    case 'oportunidade':
      const oportunidade = oportunidades.find(o => o.id === entityId);
      const orcamentoOp = orcamentos.find(ot => ot.id_oportunidade === entityId);
      return { oportunidade, orcamento: orcamentoOp };
    
    case 'orcamento':
      const orcamento = orcamentos.find(o => o.id === entityId);
      const contratoOr = contratos.find(c => c.id_orcamento === entityId);
      return { orcamento, contrato: contratoOr };
    
    case 'contrato':
      const contrato = contratos.find(c => c.id === entityId);
      const orcamentoContrato = orcamentos.find(o => o.id === contrato?.id_orcamento);
      return { contrato, orcamento: orcamentoContrato };
    
    default:
      return {};
  }
};