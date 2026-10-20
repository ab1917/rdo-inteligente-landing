import { useMemo } from 'react';
import { useCommercialData } from './useCommercialData';
import { useLeads } from './crm/useLeads';
import { useOportunidades } from './crm/useOportunidades';
import { useOrcamentos } from './crm/useOrcamentos';
import { useContratos } from './crm/useContratos';
import { useBoletimMedicao } from './useBoletimMedicao';
import { useRDO } from './useRDO';
import { deriveContractTotals } from '@/services/financeiro/contractTotals';
import { calculateDashboard } from '@/services/crm/dashboardCalculator';
import { getRelatedData as related } from '@/services/crm/relatedDataService';
export const useCRMIntegration = () => {
 const data=useCommercialData(), leads=useLeads(), opportunities=useOportunidades(), budgets=useOrcamentos(), contracts=useContratos();
 const {boletins,loading:bulletinLoading,error:bulletinError}=useBoletimMedicao();const {rdos,loading:rdoLoading,error:rdoError}=useRDO();
 const contratos=useMemo(()=>deriveContractTotals(data.contratos,boletins,rdos),[data.contratos,boletins,rdos]);
 const dashboard=useMemo(()=>calculateDashboard(data.leads,data.oportunidades,data.orcamentos,contratos),[data.leads,data.oportunidades,data.orcamentos,contratos]);
 return {...data,...leads,...opportunities,...budgets,...contracts,contratos,dashboard,loading:data.loading||bulletinLoading||rdoLoading,error:data.error||bulletinError||rdoError,
 loadData:data.reload,calculateDashboard:()=>dashboard,getRelatedData:(id:string,type:'lead'|'oportunidade'|'orcamento'|'contrato')=>related(id,type,data.leads,data.oportunidades,data.orcamentos,contratos)};
};
