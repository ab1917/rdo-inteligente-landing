import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Lead, Cliente, OportunidadeExpandida, OrcamentoIntegrado, ContratoIntegrado, BoletimMedicao } from '@/types';
export interface CommercialData { leads: Lead[]; clientes: Cliente[]; oportunidades: OportunidadeExpandida[]; orcamentos: OrcamentoIntegrado[]; contratos: ContratoIntegrado[]; }
export async function commercialRequest<T>(name: 'neon-commercial' | 'neon-boletins', body?: unknown): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, body ? { method: 'POST', body } : { method: 'GET' });
  if (error) {
    const details = error instanceof FunctionsHttpError ? await error.context.json().catch(() => null) : null;
    throw new Error(details?.error ?? error.message);
  }
  return data as T;
}
export const emptyCommercial: CommercialData = { leads: [], clientes: [], oportunidades: [], orcamentos: [], contratos: [] };
export async function listCommercial(): Promise<CommercialData> {
  const result = { ...emptyCommercial };
  let before: string | null = null;
  do {
    const page: { records: { entity: keyof CommercialData; document: any }[]; next: string | null } = await commercialRequest('neon-commercial', { action: 'list', before });
    for (const record of page.records) result[record.entity] = [...result[record.entity], record.document] as any;
    before = page.next;
  } while (before);
  return result;
}
export async function listBulletins(): Promise<BoletimMedicao[]> {
  const result: BoletimMedicao[] = [];
  let before: string | null = null;
  do {
    const page: { boletins: BoletimMedicao[]; next: string | null } = await commercialRequest('neon-boletins', { action: 'list', before });
    result.push(...page.boletins); before = page.next;
  } while (before);
  return result;
}
