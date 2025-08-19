import { vitePlugin as remixVitePlugin } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite';
import UnoCSS from 'unocss/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig((config) => {
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    ssr: {
      external: ['undici'],
      noExternal: [],
    },
    build: {
      target: 'esnext',
      outDir: 'build/client', // Vercel expects the build output in this directory
      rollupOptions: {
        external: [
          'child_process', 
          'fs', 
          'os', 
          'path', 
          'crypto', 
          'util',
          'util/types',
          'undici',
          'node:*',
          /^node:/
        ],
        output: {
          manualChunks(id) {
            // Only chunk modules that aren't externalized
            if (id.includes('node_modules')) {
              if (id.includes('@radix-ui')) {
                return 'ui-vendor';
              }
              if (id.includes('@codemirror')) {
                return 'codemirror-vendor';
              }
              if (id.includes('ai') || id.includes('@ai-sdk')) {
                return 'ai-vendor';
              }
              if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
                return 'chart-vendor';
              }
              if (id.includes('shiki')) {
                return 'shiki-vendor';
              }
              if (id.includes('react') && !id.includes('react-chartjs-2')) {
                return 'react-vendor';
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    },
    plugins: [
      nodePolyfills({
        include: ['buffer', 'process', 'util', 'stream'],
        globals: {
          Buffer: true,
          process: true,
          global: true,
        },
        protocolImports: true,
        exclude: [
          'child_process', 
          'fs', 
          'crypto', 
          'path', 
          'undici' as any,
          'node:*' as any
        ],
      }),
      {
        name: 'buffer-polyfill',
        transform(code, id) {
          if (id.includes('env.mjs')) {
            return {
              code: `import { Buffer } from 'buffer';
${code}`,
              map: null,
            };
          }

          return null;
        },
      },
      {
        name: 'externalize-node-modules',
        resolveId(id, importer) {
          // Externalize undici and all node: imports
          if (id === 'undici' || id.startsWith('node:')) {
            return { id, external: true };
          }
          
          // Handle util/types specifically
          if (id === 'util/types' || id.endsWith('/util/types')) {
            return { id: 'node:util/types', external: true };
          }
          
          // If this is being imported from undici, externalize it
          if (importer && importer.includes('undici')) {
            if (id.startsWith('node:') || ['util', 'crypto', 'fs', 'path', 'os', 'util/types'].includes(id)) {
              return { id, external: true };
            }
          }
          
          return null;
        },
      },
      // Removed remixCloudflareDevProxy() for Vercel deployment
      remixVitePlugin({
        presets: [vercelPreset()],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      UnoCSS(),
      tsconfigPaths(),
      chrome129IssuePlugin(),
      config.mode === 'production' && optimizeCssModules({ apply: 'build' }),
    ],
    envPrefix: [
      'VITE_',
      'OPENAI_LIKE_API_BASE_URL',
      'OLLAMA_API_BASE_URL',
      'LMSTUDIO_API_BASE_URL',
      'TOGETHER_API_BASE_URL',
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // api: 'modern-compiler', // Removed due to incompatibility with newer Vite versions
        },
      },
    },
    // Add Vercel-specific server configuration
    server: {
      port: 3000,
    },
  };
});

function chrome129IssuePlugin() {
  return {
    name: 'chrome129IssuePlugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const raw = req.headers['user-agent']?.match(/Chrom(e|ium)\/([0-9]+)\./);

        if (raw) {
          const version = parseInt(raw[2], 10);

          if (version === 129) {
            res.setHeader('content-type', 'text/html');
            res.end(
              '<body><h1>Please use Chrome Canary for testing.</h1><p>Chrome 129 has an issue with JavaScript modules & Vite local development, see <a href="https://github.com/stackblitz/bolt.new/issues/86#issuecomment-2395519258">for more information.</a></p><p><b>Note:</b> This only impacts <u>local development</u>. `pnpm run build` and `pnpm run start` will work fine in this browser.</p></body>',
            );

            return;
          }
        }

        next();
      });
    },
  };
}