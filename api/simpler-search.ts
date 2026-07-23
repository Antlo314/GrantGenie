/**
 * POST /api/simpler-search
 * Body: { query: string, limit?: number }
 * Uses SIMPLER_GRANTS_API_KEY from Vercel env (server-only).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchSimplerGrants } from '../server/handlers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const result = await searchSimplerGrants(
      String(body.query || ''),
      Number(body.limit || 25),
      process.env
    );
    return res.status(200).json(result);
  } catch (e: unknown) {
    return res.status(500).json({
      opportunities: [],
      hitCount: 0,
      error: e instanceof Error ? e.message : 'Simpler proxy error',
    });
  }
}
