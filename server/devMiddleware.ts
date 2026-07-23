/**
 * Vite dev middleware: /api/proxy/* and /api/sam-search keep API keys on the server.
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

function freshEnv(mode: string) {
  // Re-read .env* every request so new keys work without a full process restart
  return { ...process.env, ...loadEnv(mode, process.cwd(), '') };
}

function pathOnly(url: string) {
  return (url || '').split('?')[0];
}

export function grantGenieApiPlugin(mode: string): Plugin {
  return {
    name: 'grant-genie-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = pathOnly(req.url || '');
        const isProxy = path.startsWith('/api/proxy');
        const isSam = path === '/api/sam-search';
        const isSimpler = path === '/api/simpler-search';
        const isStatus = path === '/api/sources-status' || path === '/api/proxy/status';
        if (!isProxy && !isSam && !isSimpler && !isStatus) return next();

        const env = freshEnv(mode);

        try {
          if (isStatus && req.method === 'GET') {
            return sendJson(res, 200, { sources: sourceStatusList(env) });
          }

          if (
            (path === '/api/proxy/simpler/search' || isSimpler) &&
            req.method === 'POST'
          ) {
            const raw = await readBody(req);
            const body = raw ? JSON.parse(raw) : {};
            const result = await searchSimplerGrants(
              String(body.query || ''),
              Number(body.limit || 25),
              env
            );
            return sendJson(res, 200, result);
          }

          if ((path === '/api/proxy/sam/search' || isSam) && req.method === 'POST') {
            const raw = await readBody(req);
            const body = raw ? JSON.parse(raw) : {};
            const result = await searchSamOpportunities(
              String(body.query || ''),
              Number(body.limit || 25),
              env
            );
            return sendJson(res, 200, result);
          }

          if (path === '/api/proxy/grants-usa/search' && req.method === 'POST') {
            const raw = await readBody(req);
            const body = raw ? JSON.parse(raw) : {};
            const result = await searchGrantsUsa(
              String(body.query || ''),
              Number(body.limit || 20),
              env
            );
            return sendJson(res, 200, result);
          }

          if (isProxy) {
            return sendJson(res, 404, { error: `Unknown proxy route: ${path}` });
          }
          return next();
        } catch (e: unknown) {
          return sendJson(res, 500, {
            error: e instanceof Error ? e.message : 'Proxy error',
          });
        }
      });
    },
  };
}
