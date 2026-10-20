import type { ContratoIntegrado, BoletimMedicao, RDO } from '@/types';
export function deriveContractTotals(contracts: ContratoIntegrado[], bulletins: BoletimMedicao[], rdos: RDO[]): ContratoIntegrado[] {
 return contracts.map(c => {
  const linked=bulletins.filter(b=>b.id_contrato===c.id);
  const approved=linked.filter(b=>b.status==='aprovado'||b.status==='faturado');
  const scope=approved.filter(b=>b.tipo_medicao==='escopo_fechado');
  const revenue=approved.reduce((s,b)=>s+b.resumo_financeiro.total_geral,0);
  const invoiced=linked.filter(b=>b.status==='faturado').reduce((s,b)=>s+b.resumo_financeiro.total_geral,0);
  const costs=rdos.filter(r=>r.id_contrato===c.id).reduce((s,r)=>s+r.custo_hh_realizado,0);
  const hhCosts=linked.filter(b=>b.tipo_medicao!=='escopo_fechado').reduce((s,b)=>s+b.resumo_financeiro.total_geral,0);
  const executed=Math.max(costs,hhCosts);
  const progress=scope.length?Math.max(...scope.map(b=>b.medicao_escopo?.percentual_acumulado??0)):c.percentual_execucao;
  return {...c,percentual_execucao:progress,valor_faturado_total:invoiced,valor_pendente_faturamento:Math.max(0,revenue-invoiced),custo_executado_total:executed,margem_real_atual:c.valor_fechado>0?(c.valor_fechado-executed)/c.valor_fechado*100:0};
 });
}
