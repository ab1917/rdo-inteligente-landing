import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { commercialRequest, listBulletins } from '@/services/neonCommercial';
import { buildConfiguredBoletim } from '@/services/configuredBoletim';
import { createMeasurementConfig, type MeasurementConfig } from '@/services/measurementConfig';
import type { BoletimMedicao, RDO } from '@/types';
export const useBoletimMedicao = () => {
 const {user,isLoading}=useAuth();const client=useQueryClient();const [saving,setSaving]=useState(false);
 const key=['neon-boletins',user?.company_id,user?.id];
 const query=useQuery({queryKey:key,queryFn:listBulletins,enabled:!!user,retry:false,staleTime:60000});
 const save=async(body:unknown)=>{setSaving(true);try{const result=await commercialRequest<{boletim:BoletimMedicao}>('neon-boletins',body);await client.invalidateQueries({queryKey:key});await client.invalidateQueries({queryKey:['neon-commercial']});return result.boletim;}finally{setSaving(false);}};
 const gerarBoletimConsolidado=(rdos:RDO[],obra:string,inicio:string,fim:string,config:MeasurementConfig=createMeasurementConfig(),contractId?:string)=>save({action:'hh',bulletin:{...buildConfiguredBoletim(rdos,config,obra,inicio,fim),...(contractId?{id_contrato:contractId}:{})}});
 return {boletins:user?query.data??[]:[],loading:isLoading|| (!!user&&query.isPending)||saving,saving,error:query.error?.message??'',reload:query.refetch,
 gerarBoletimConsolidado,gerarBoletimDeRDO:(rdo:RDO,config?:MeasurementConfig)=>gerarBoletimConsolidado([rdo],rdo.obra,rdo.data,rdo.data,config),
 gerarBoletimEscopo:(contractId:string,inicio:string,fim:string,percentual:number,descricao:string)=>save({action:'scope',id:crypto.randomUUID(),contract_id:contractId,inicio,fim,percentual,descricao}),
 aprovarBoletim:(id:string,_aprovadoPor?:string)=>save({action:'status',id,status:'aprovado'}),faturarBoletim:(id:string)=>save({action:'status',id,status:'faturado'})};
};
