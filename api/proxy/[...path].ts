/**
 * Vercel serverless: /api/proxy/* — injects server-side API keys.
 * Mirrors local Vite middleware in server/devMiddleware.ts
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  searchGrantsUsa,
  searchSamOpportunities,
  searchSimplerGrants,
} from '../../server/handlers';
import { sourceStatusList } from '../../server/sourceKeys';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const parts = ([] as string[]).concat((req.query.path as string | string[]) || []);
  const route = parts.join('/');

  try {
    if (route === 'status' && req.method === 'GET') {
      return res.status(200).json({ sources: sourceStatusList(process.env) });
    }

    if (route === 'simpler/search' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const result = await searchSimplerGrants(
        String(body.query || ''),
        Number(body.limit || 25),
        process.env
      );
      return res.status(200).json(result);
    }

    if (route === 'sam/search' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const result = await searchSamOpportunities(
        String(body.query || ''),
        Number(body.limit || 25),
        process.env
      );
      return res.status(200).json(result);
    }

    if (route === 'grants-usa/search' && req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const result = await searchGrantsUsa(
        String(body.query || ''),
        Number(body.limit || 20),
        process.env
      );
      return res.status(200).json(result);
    }

    return res.status(404).json({ error: `Unknown route: ${route}` });
  } catch (e: unknown) {
    return res.status(500).json({
      error: e instanceof Error ? e.message : 'Proxy error',
    });
  }
}
