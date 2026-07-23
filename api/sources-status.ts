/**
 * GET /api/sources-status — which keys are configured (no secret values).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sourceStatusList } from '../server/sourceKeys';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET' });
  }
  return res.status(200).json({ sources: sourceStatusList(process.env) });
}
