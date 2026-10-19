import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { RDO } from '@/types';

export async function rdoRequest<T>(options: { method?: 'GET' | 'POST'; body?: unknown }, before?: string): Promise<T> {
  const name = before ? `neon-rdos?before=${encodeURIComponent(before)}` : 'neon-rdos';
  const { data, error } = await supabase.functions.invoke(name, options);
  if (error) {
    let message = error.message;
    if (error instanceof FunctionsHttpError) {
      const details = await error.context.json().catch(() => null);
      message = details?.error ?? message;
    }
    throw new Error(message);
  }
  return data as T;
}

export async function listNeonRDOs(): Promise<RDO[]> {
  const rdos: RDO[] = [];
  let before: string | undefined;
  do {
    const page = await rdoRequest<{ rdos: RDO[]; next: string | null }>({ method: 'GET' }, before);
    rdos.push(...page.rdos);
    before = page.next ?? undefined;
  } while (before);
  return rdos;
}