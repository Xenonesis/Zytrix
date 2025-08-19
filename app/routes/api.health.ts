import type { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

export const loader = async ({ request: _request }: LoaderFunctionArgs) => {
  return json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
};
