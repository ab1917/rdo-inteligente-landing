import { supabase } from '@/integrations/supabase/client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export { supabase };
export const SUPABASE_URL = supabaseUrl;

export type ConnectivityStatus = 'ok' | 'unreachable' | 'unauthorized' | 'error';

export interface ConnectivityResult {
  status: ConnectivityStatus;
  url: string;
  httpStatus?: number;
  message: string;
}

/**
 * Verifica se o endpoint de autenticação está alcançável
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
        message: `O servidor respondeu ${response.status}: a chave de acesso parece inválida ou expirada.`,
      };
    }

    return {
      status: 'error',
      url: supabaseUrl,
      httpStatus: response.status,
      message: `O servidor de autenticação respondeu com erro ${response.status}.`,
    };
  } catch (err) {
    const aborted = (err as Error)?.name === 'AbortError';
    return {
      status: 'unreachable',
      url: supabaseUrl,
      message: aborted
        ? `Tempo esgotado (${timeoutMs / 1000}s) ao contatar o servidor de autenticação.`
        : 'Não foi possível alcançar o servidor de autenticação. Verifique sua conexão com a internet.',
    };
  } finally {
    clearTimeout(timer);
  }
};
