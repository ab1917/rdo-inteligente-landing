import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qndffmktwtoezehbtnnf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZGZmbWt0d3RvZXplaGJ0bm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzU0MjgsImV4cCI6MjA2MjgxMTQyOH0.gFAixD_8EIME94jXhBnKBeeeTtx4PKexBKZ_Ga2WKq4';

export const SUPABASE_URL = supabaseUrl;

// Untyped client to avoid schema drift between DB and generated types.
export const supabase = createClient(supabaseUrl, supabaseKey);

export type ConnectivityStatus = 'ok' | 'unreachable' | 'unauthorized' | 'error';

export interface ConnectivityResult {
  status: ConnectivityStatus;
  url: string;
  httpStatus?: number;
  message: string;
}

/**
 * Verifica se o endpoint de autenticação do Supabase está alcançável
 * (DNS resolvendo, projeto ativo e chave anônima aceita).
 */
export const checkSupabaseConnectivity = async (
  timeoutMs = 8000,
): Promise<ConnectivityResult> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: 'GET',
      headers: { apikey: supabaseKey },
      signal: controller.signal,
    });

    if (response.ok) {
      return { status: 'ok', url: supabaseUrl, httpStatus: response.status, message: 'Conexão com o servidor de autenticação OK.' };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        status: 'unauthorized',
        url: supabaseUrl,
        httpStatus: response.status,
        message: `O servidor respondeu ${response.status}: a chave anônima (anon key) parece inválida ou expirada para o projeto ${supabaseUrl}.`,
      };
    }

    return {
      status: 'error',
      url: supabaseUrl,
      httpStatus: response.status,
      message: `O servidor de autenticação respondeu com erro ${response.status}. Verifique se o projeto ${supabaseUrl} está ativo (não pausado).`,
    };
  } catch (err) {
    const aborted = (err as Error)?.name === 'AbortError';
    return {
      status: 'unreachable',
      url: supabaseUrl,
      message: aborted
        ? `Tempo esgotado (${timeoutMs / 1000}s) ao contatar ${supabaseUrl}. O projeto pode estar pausado ou bloqueado pela rede.`
        : `Não foi possível resolver/alcançar ${supabaseUrl}. Causas comuns: projeto pausado ou removido, URL incorreta, DNS/firewall bloqueando o domínio.`,
    };
  } finally {
    clearTimeout(timer);
  }
};
