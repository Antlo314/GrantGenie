/**
 * POST /api/sam-search
 * Body: { query: string, limit?: number }
 * Uses SAM_API_KEY from Vercel env (server-only).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchSamOpportunities } from '../server/handlers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const result = await searchSamOpportunities(
      String(body.query || ''),
      Number(body.limit || 25),
      process.env
    );
    return res.status(200).json(result);
  } catch (e: unknown) {
    return res.status(500).json({
      opportunities: [],
      hitCount: 0,
      error: e instanceof Error ? e.message : 'SAM proxy error',
    });
  }
}
