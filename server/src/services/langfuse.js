import { Langfuse } from 'langfuse';

let _client = null;

function getClient() {
  if (!_client && process.env.LANGFUSE_SECRET_KEY && process.env.LANGFUSE_PUBLIC_KEY) {
    _client = new Langfuse({
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
    });
    _client.on('error', (err) => console.error('[langfuse error]', err.message));
  }
  return _client;
}

/**
 * Create a Langfuse trace. Returns null if Langfuse is not configured.
 * All callers should treat null gracefully (Langfuse is optional).
 */
export function createTrace(params) {
  try {
    return getClient()?.trace(params) ?? null;
  } catch {
    return null;
  }
}

/**
 * Flush pending Langfuse events. Fire-and-forget — never blocks the response.
 */
export function flush() {
  try {
    return getClient()?.flushAsync() ?? Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}
