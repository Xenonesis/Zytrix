import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';

export const onRequest: PagesFunction = async (context) => {
  const serverBuild: any = await import('../build/server');

  const handler = createPagesFunctionHandler({
    build: serverBuild,
  });

  return handler(context);
};
