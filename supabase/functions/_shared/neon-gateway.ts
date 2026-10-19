const GATEWAY_URL = 'https://connector-gateway.lovable.dev/neon';

// Env is read per request inside the server boundary: module-scope reads are
// undefined on Cloudflare Workers and can leak into the client bundle.
function gatewayHeaders(): Record<string, string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const NEON_API_KEY = Deno.env.get('NEON_API_KEY'); // connection key (lovc_…), not a Neon key
  if (!LOVABLE_API_KEY || !NEON_API_KEY) {
    throw new Error('Missing LOVABLE_API_KEY or NEON_API_KEY');
  }
  return {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    'X-Connection-Api-Key': NEON_API_KEY,
    'Content-Type': 'application/json',
  };
}

type Statement = { query: string; params?: unknown[] };
export type NeonResult = {
  rows: Record<string, unknown>[];
  fields: { name: string; dataTypeID: number }[];
  rowCount: number | null;
  command: string;
};
type NeonResponse = { status: number; retryAfter: string | null; text: string; json: any; elapsedMs: number };
type NeonErrorKind = 'stale_connection' | 'endpoint_blocked' | 'maybe_committed' | 'too_large' | 'rate_limited' | 'unavailable' | 'input' | 'statement' | 'rejected';
type NeonError = Error & { status: number; code?: string; body: string; kind: NeonErrorKind };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const toBody = (q: string | Statement[], params: unknown[]) =>
  typeof q === 'string' ? { query: q, params } : { queries: q };

async function neonFetch(body: unknown, headers: Record<string, string>, signal?: AbortSignal): Promise<NeonResponse> {
  const base = gatewayHeaders();
  const started = Date.now();
  try {
    const res = await fetch(`${GATEWAY_URL}/sql`, {
      method: 'POST',
      headers: { ...base, ...headers },
      body: JSON.stringify(body),
      signal,
    });
    const text = await res.text();
    let json: any;
    try { json = JSON.parse(text); } catch { json = {}; }
    return { status: res.status, retryAfter: res.headers.get('Retry-After'), text, json, elapsedMs: Date.now() - started };
  } catch (err: any) {
    return { status: 0, retryAfter: null, text: '', json: { message: String(err?.name ?? err) }, elapsedMs: Date.now() - started };
  }
}

const isStale = (json: any) =>
  json?.code === '28P01' || json?.code === '28000' ||
  /^(password authentication failed|Control plane request failed: endpoint cannot be found)/.test(json?.message ?? '');
const isEndpointBlocked = (json: any) =>
  /^(The endpoint has been disabled|Control plane request failed: endpoint is)/.test(json?.message ?? '');

function neonFailure(r: NeonResponse, write: boolean): NeonError {
  const { status, json, elapsedMs } = r;
  let hint: string;
  let kind: NeonErrorKind;
  if (isStale(json)) {
    kind = 'stale_connection';
    hint = 'the stored connection string no longer works: stop retrying';
  } else if (isEndpointBlocked(json)) {
    kind = 'endpoint_blocked';
    hint = 'Neon is not serving this endpoint (disabled, or a quota or billing limit)';
  } else if (status === 413) {
    kind = 'too_large';
    hint = 'request too large';
  } else if (status === 507) {
    kind = 'too_large';
    hint = 'result too large';
  } else if (status === 429) {
    kind = 'rate_limited';
    hint = 'Lovable gateway rate limit (per project), not Neon';
  } else if (status === 0 || status === 502) {
    const slow = /^(TimeoutError|AbortError)/.test(json?.message ?? '') || elapsedMs >= 25_000;
    kind = write ? 'maybe_committed' : slow ? 'statement' : 'unavailable';
    hint = slow ? 'too slow' : 'the gateway could not reach Neon';
    if (write) hint = `the statement may have committed: check the row before re-running; ${hint}`;
  } else if (/^2[23]/.test(json?.code ?? '')) {
    kind = 'input';
    hint = 'the values break a constraint or a type';
  } else if (status === 400) {
    kind = 'statement';
    hint = 'fix the statement; never retry unchanged';
  } else if (status >= 500) {
    kind = 'unavailable';
    hint = 'Neon error';
  } else {
    kind = 'rejected';
    hint = 'gateway rejection, not retryable';
  }
  const code = json?.code || json?.type;
  return Object.assign(
    new Error(`Neon ${status}${code ? ` ${code}` : ''}: ${json?.message ?? r.text.slice(0, 300)} (${hint})`),
    { status, code, body: r.text, kind },
  );
}

export function neonUserError(err: unknown): { status: number; message: string } {
  switch ((err as Partial<NeonError>)?.kind) {
    case 'stale_connection':
      return { status: 503, message: 'A conexão configurada com o banco de dados não funciona mais. O responsável precisa substituí-la nas configurações de conectores.' };
    case 'endpoint_blocked':
      return { status: 503, message: 'O banco de dados não está disponível no momento. Verifique o endpoint e o plano no Neon.' };
    case 'maybe_committed':
      return { status: 503, message: 'A alteração pode ter sido salva. Atualize para conferir antes de tentar novamente.' };
    case 'too_large':
      return { status: 413, message: 'Esta requisição ou seu resultado é grande demais para uma chamada. Reduza e tente novamente.' };
    case 'rate_limited':
      return { status: 429, message: 'O banco de dados está ocupado. Tente novamente em instantes.' };
    case 'unavailable':
      return { status: 503, message: 'O banco de dados está temporariamente indisponível. Tente novamente em instantes.' };
    case 'input':
      return { status: 400, message: 'O banco de dados rejeitou estes valores. Confira os dados e tente novamente.' };
    default:
      return { status: 500, message: 'Não foi possível concluir a requisição ao banco de dados.' };
  }
}

export async function neonQuery<T = NeonResult>(
  query: string | Statement[], params: unknown[] = [], headers: Record<string, string> = {},
): Promise<T> {
  const deadline = Date.now() + 30_000;
  const left = () => Math.max(0, deadline - Date.now());
  let retried429 = false;
  for (let attempt = 1; ; attempt++) {
    const r = await neonFetch(toBody(query, params), headers, AbortSignal.timeout(Math.max(1, left())));
    if (r.status >= 200 && r.status < 300) return r.json as T;
    if (isStale(r.json) || isEndpointBlocked(r.json)) throw neonFailure(r, false);
    if (r.status === 429 && !retried429) {
      retried429 = true;
      const seconds = Math.min(Math.max(Number(r.retryAfter) || 1, 1), 15);
      await sleep(Math.min(seconds * 1000, left()));
      continue;
    }
    const backoff = 500 * 2 ** (attempt - 1);
    if ((r.status === 500 || r.status === 503) && attempt < 3 && backoff < left()) {
      await sleep(backoff);
      continue;
    }
    throw neonFailure(r, false);
  }
}

export async function neonExecute<T = NeonResult>(
  query: string | Statement[], params: unknown[] = [], headers: Record<string, string> = {},
): Promise<T> {
  const r = await neonFetch(toBody(query, params), headers);
  if (r.status >= 200 && r.status < 300) return r.json as T;
  throw neonFailure(r, true);
}

