/**
 * Vite dev middleware: /api/proxy/* keeps API keys on the server.
 */
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { loadEnv } from 'vite';
import { searchSamOpportunities, searchSimplerGrants, searchGrantsUsa } from './handlers';
import { sourceStatusList } from './sourceKeys';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function grantGenieApiPlugin(mode: string): Plugin {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return {
    name: 'grant-genie-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/proxy')) return next();

        try {
          if (url.startsWith('/api/proxy/status') && req.method === 'GET') {
            return sendJson(res, 200, { sources: sourceStatusList(env) });
          }

          if (url.startsWith('/api/proxy/simpler/search') && req.method === 'POST') {
            const raw = await readBody(req);
            const body = raw ? JSON.parse(raw) : {};
            const result = await searchSimplerGrants(
              String(body.query || ''),
              Number(body.limit || 25),
              env
            );
            return sendJson(res, 200, result);
          }

          if (url.startsWith('/api/proxy/sam/search') && req.method === 'POST') {
            const raw = await readBody(req);
            const body = raw ? JSON.parse(raw) : {};
            const result = await searchSamOpportunities(
              String(body.query || ''),
              Number(body.limit || 25),
              env
            );
            return sendJson(res, 200, result);
          }

          if (url.startsWith('/api/proxy/grants-usa/search') && req.method === 'POST') {
            const raw = await readBody(req);
            const body = raw ? JSON.parse(raw) : {};
            const result = await searchGrantsUsa(
              String(body.query || ''),
              Number(body.limit || 20),
              env
            );
            return sendJson(res, 200, result);
          }

          return sendJson(res, 404, { error: 'Unknown proxy route' });
        } catch (e: unknown) {
          return sendJson(res, 500, {
            error: e instanceof Error ? e.message : 'Proxy error',
          });
        }
      });
    },
  };
}
