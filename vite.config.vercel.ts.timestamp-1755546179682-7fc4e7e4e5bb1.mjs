// vite.config.vercel.ts
import { vitePlugin as remixVitePlugin } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/@remix-run+dev@2.16.8_@remix-run+react@2.16.8_react-dom@18.3.1_react@18.3.1__react@18.3.1_typ_w7rifulznkxcnl2xvvx3mnhj5a/node_modules/@remix-run/dev/dist/index.js";
import { vercelPreset } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/@vercel+remix@2.16.7_@remix-run+dev@2.16.8_@remix-run+react@2.16.8_react-dom@18.3.1_react@18._taalvlw244unb65abqigdnhada/node_modules/@vercel/remix/vite.js";
import UnoCSS from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/unocss@0.61.9_postcss@8.5.6_rollup@4.45.1_vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2_/node_modules/unocss/dist/vite.mjs";
import { defineConfig } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/vite-plugin-node-polyfills@0.22.0_rollup@4.45.1_vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2_/node_modules/vite-plugin-node-polyfills/dist/index.js";
import { optimizeCssModules } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/vite-plugin-optimize-css-modules@1.2.0_vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2_/node_modules/vite-plugin-optimize-css-modules/dist/index.mjs";
import tsconfigPaths from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.8.3_vite@5.4.19_@types+node@24.1.0_sass-embedded@1.89.2_/node_modules/vite-tsconfig-paths/dist/index.mjs";
import * as dotenv from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/dotenv@16.6.1/node_modules/dotenv/lib/main.js";
dotenv.config();
var vite_config_vercel_default = defineConfig((config2) => {
  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    },
    ssr: {
      external: ["undici"],
      noExternal: []
    },
    build: {
      target: "esnext",
      outDir: "build/client",
      // Vercel expects the build output in this directory
      rollupOptions: {
        external: [
          "child_process",
          "fs",
          "os",
          "path",
          "crypto",
          "util",
          "undici",
          "node:*",
          /^node:/
        ],
        output: {
          manualChunks: {
            // Split vendor libraries into separate chunks
            "react-vendor": ["react", "react-dom"],
            "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-popover"],
            "codemirror-vendor": ["@codemirror/view", "@codemirror/state", "@codemirror/language"],
            "ai-vendor": ["ai", "@ai-sdk/openai", "@ai-sdk/anthropic"],
            "chart-vendor": ["chart.js", "react-chartjs-2"],
            "shiki-vendor": ["shiki"]
          }
        }
      },
      chunkSizeWarningLimit: 1e3
      // Increase warning limit to 1MB
    },
    plugins: [
      nodePolyfills({
        include: ["buffer", "process", "util", "stream"],
        globals: {
          Buffer: true,
          process: true,
          global: true
        },
        protocolImports: true,
        exclude: [
          "child_process",
          "fs",
          "crypto",
          "path",
          "undici",
          "node:*"
        ]
      }),
      {
        name: "buffer-polyfill",
        transform(code, id) {
          if (id.includes("env.mjs")) {
            return {
              code: `import { Buffer } from 'buffer';
${code}`,
              map: null
            };
          }
          return null;
        }
      },
      {
        name: "externalize-node-modules",
        resolveId(id, importer) {
          if (id === "undici" || id.startsWith("node:") || id.startsWith("util/types")) {
            return { id, external: true };
          }
          if (importer && importer.includes("undici")) {
            if (id.startsWith("node:") || ["util", "crypto", "fs", "path", "os"].includes(id)) {
              return { id, external: true };
            }
          }
          return null;
        }
      },
      // Removed remixCloudflareDevProxy() for Vercel deployment
      remixVitePlugin({
        presets: [vercelPreset()],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true
        }
      }),
      UnoCSS(),
      tsconfigPaths(),
      chrome129IssuePlugin(),
      config2.mode === "production" && optimizeCssModules({ apply: "build" })
    ],
    envPrefix: [
      "VITE_",
      "OPENAI_LIKE_API_BASE_URL",
      "OLLAMA_API_BASE_URL",
      "LMSTUDIO_API_BASE_URL",
      "TOGETHER_API_BASE_URL"
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    },
    // Add Vercel-specific server configuration
    server: {
      port: 3e3
    }
  };
});
function chrome129IssuePlugin() {
  return {
    name: "chrome129IssuePlugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.headers["user-agent"]?.match(/Chrom(e|ium)\/([0-9]+)\./);
        if (raw) {
          const version = parseInt(raw[2], 10);
          if (version === 129) {
            res.setHeader("content-type", "text/html");
            res.end(
              '<body><h1>Please use Chrome Canary for testing.</h1><p>Chrome 129 has an issue with JavaScript modules & Vite local development, see <a href="https://github.com/stackblitz/bolt.new/issues/86#issuecomment-2395519258">for more information.</a></p><p><b>Note:</b> This only impacts <u>local development</u>. `pnpm run build` and `pnpm run start` will work fine in this browser.</p></body>'
            );
            return;
          }
        }
        next();
      });
    }
  };
}
export {
  vite_config_vercel_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudmVyY2VsLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYWRkeVxcXFxWaWRlb3NcXFxcYm9sdC5kaXktbWFpblxcXFxib2x0LmRpeS1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhZGR5XFxcXFZpZGVvc1xcXFxib2x0LmRpeS1tYWluXFxcXGJvbHQuZGl5LW1haW5cXFxcdml0ZS5jb25maWcudmVyY2VsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hZGR5L1ZpZGVvcy9ib2x0LmRpeS1tYWluL2JvbHQuZGl5LW1haW4vdml0ZS5jb25maWcudmVyY2VsLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peFZpdGVQbHVnaW4gfSBmcm9tICdAcmVtaXgtcnVuL2Rldic7XHJcbmltcG9ydCB7IHZlcmNlbFByZXNldCB9IGZyb20gJ0B2ZXJjZWwvcmVtaXgvdml0ZSc7XHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgVml0ZURldlNlcnZlciB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnO1xyXG5pbXBvcnQgeyBvcHRpbWl6ZUNzc01vZHVsZXMgfSBmcm9tICd2aXRlLXBsdWdpbi1vcHRpbWl6ZS1jc3MtbW9kdWxlcyc7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xyXG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcclxuXHJcbmRvdGVudi5jb25maWcoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoY29uZmlnKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGRlZmluZToge1xyXG4gICAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5OT0RFX0VOViksXHJcbiAgICB9LFxyXG4gICAgc3NyOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbJ3VuZGljaSddLFxyXG4gICAgICBub0V4dGVybmFsOiBbXSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgICBvdXREaXI6ICdidWlsZC9jbGllbnQnLCAvLyBWZXJjZWwgZXhwZWN0cyB0aGUgYnVpbGQgb3V0cHV0IGluIHRoaXMgZGlyZWN0b3J5XHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBleHRlcm5hbDogW1xyXG4gICAgICAgICAgJ2NoaWxkX3Byb2Nlc3MnLCBcclxuICAgICAgICAgICdmcycsIFxyXG4gICAgICAgICAgJ29zJywgXHJcbiAgICAgICAgICAncGF0aCcsIFxyXG4gICAgICAgICAgJ2NyeXB0bycsIFxyXG4gICAgICAgICAgJ3V0aWwnLFxyXG4gICAgICAgICAgJ3VuZGljaScsXHJcbiAgICAgICAgICAnbm9kZToqJyxcclxuICAgICAgICAgIC9ebm9kZTovXHJcbiAgICAgICAgXSxcclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgICAvLyBTcGxpdCB2ZW5kb3IgbGlicmFyaWVzIGludG8gc2VwYXJhdGUgY2h1bmtzXHJcbiAgICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxyXG4gICAgICAgICAgICAndWktdmVuZG9yJzogWydAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JywgJ0ByYWRpeC11aS9yZWFjdC1wb3BvdmVyJ10sXHJcbiAgICAgICAgICAgICdjb2RlbWlycm9yLXZlbmRvcic6IFsnQGNvZGVtaXJyb3IvdmlldycsICdAY29kZW1pcnJvci9zdGF0ZScsICdAY29kZW1pcnJvci9sYW5ndWFnZSddLFxyXG4gICAgICAgICAgICAnYWktdmVuZG9yJzogWydhaScsICdAYWktc2RrL29wZW5haScsICdAYWktc2RrL2FudGhyb3BpYyddLFxyXG4gICAgICAgICAgICAnY2hhcnQtdmVuZG9yJzogWydjaGFydC5qcycsICdyZWFjdC1jaGFydGpzLTInXSxcclxuICAgICAgICAgICAgJ3NoaWtpLXZlbmRvcic6IFsnc2hpa2knXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLCAvLyBJbmNyZWFzZSB3YXJuaW5nIGxpbWl0IHRvIDFNQlxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgbm9kZVBvbHlmaWxscyh7XHJcbiAgICAgICAgaW5jbHVkZTogWydidWZmZXInLCAncHJvY2VzcycsICd1dGlsJywgJ3N0cmVhbSddLFxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIEJ1ZmZlcjogdHJ1ZSxcclxuICAgICAgICAgIHByb2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICBnbG9iYWw6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwcm90b2NvbEltcG9ydHM6IHRydWUsXHJcbiAgICAgICAgZXhjbHVkZTogW1xyXG4gICAgICAgICAgJ2NoaWxkX3Byb2Nlc3MnLCBcclxuICAgICAgICAgICdmcycsIFxyXG4gICAgICAgICAgJ2NyeXB0bycsIFxyXG4gICAgICAgICAgJ3BhdGgnLCBcclxuICAgICAgICAgICd1bmRpY2knLFxyXG4gICAgICAgICAgJ25vZGU6KidcclxuICAgICAgICBdLFxyXG4gICAgICB9KSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdidWZmZXItcG9seWZpbGwnLFxyXG4gICAgICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdlbnYubWpzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICBjb2RlOiBgaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJztcclxuJHtjb2RlfWAsXHJcbiAgICAgICAgICAgICAgbWFwOiBudWxsLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnZXh0ZXJuYWxpemUtbm9kZS1tb2R1bGVzJyxcclxuICAgICAgICByZXNvbHZlSWQoaWQsIGltcG9ydGVyKSB7XHJcbiAgICAgICAgICAvLyBFeHRlcm5hbGl6ZSB1bmRpY2kgYW5kIGFsbCBub2RlOiBpbXBvcnRzXHJcbiAgICAgICAgICBpZiAoaWQgPT09ICd1bmRpY2knIHx8IGlkLnN0YXJ0c1dpdGgoJ25vZGU6JykgfHwgaWQuc3RhcnRzV2l0aCgndXRpbC90eXBlcycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGlkLCBleHRlcm5hbDogdHJ1ZSB9O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBJZiB0aGlzIGlzIGJlaW5nIGltcG9ydGVkIGZyb20gdW5kaWNpLCBleHRlcm5hbGl6ZSBpdFxyXG4gICAgICAgICAgaWYgKGltcG9ydGVyICYmIGltcG9ydGVyLmluY2x1ZGVzKCd1bmRpY2knKSkge1xyXG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aCgnbm9kZTonKSB8fCBbJ3V0aWwnLCAnY3J5cHRvJywgJ2ZzJywgJ3BhdGgnLCAnb3MnXS5pbmNsdWRlcyhpZCkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4geyBpZCwgZXh0ZXJuYWw6IHRydWUgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBSZW1vdmVkIHJlbWl4Q2xvdWRmbGFyZURldlByb3h5KCkgZm9yIFZlcmNlbCBkZXBsb3ltZW50XHJcbiAgICAgIHJlbWl4Vml0ZVBsdWdpbih7XHJcbiAgICAgICAgcHJlc2V0czogW3ZlcmNlbFByZXNldCgpXSxcclxuICAgICAgICBmdXR1cmU6IHtcclxuICAgICAgICAgIHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxyXG4gICAgICAgICAgdjNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXHJcbiAgICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxyXG4gICAgICAgICAgdjNfbGF6eVJvdXRlRGlzY292ZXJ5OiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBVbm9DU1MoKSxcclxuICAgICAgdHNjb25maWdQYXRocygpLFxyXG4gICAgICBjaHJvbWUxMjlJc3N1ZVBsdWdpbigpLFxyXG4gICAgICBjb25maWcubW9kZSA9PT0gJ3Byb2R1Y3Rpb24nICYmIG9wdGltaXplQ3NzTW9kdWxlcyh7IGFwcGx5OiAnYnVpbGQnIH0pLFxyXG4gICAgXSxcclxuICAgIGVudlByZWZpeDogW1xyXG4gICAgICAnVklURV8nLFxyXG4gICAgICAnT1BFTkFJX0xJS0VfQVBJX0JBU0VfVVJMJyxcclxuICAgICAgJ09MTEFNQV9BUElfQkFTRV9VUkwnLFxyXG4gICAgICAnTE1TVFVESU9fQVBJX0JBU0VfVVJMJyxcclxuICAgICAgJ1RPR0VUSEVSX0FQSV9CQVNFX1VSTCcsXHJcbiAgICBdLFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgLy8gQWRkIFZlcmNlbC1zcGVjaWZpYyBzZXJ2ZXIgY29uZmlndXJhdGlvblxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIHBvcnQ6IDMwMDAsXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gY2hyb21lMTI5SXNzdWVQbHVnaW4oKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6ICdjaHJvbWUxMjlJc3N1ZVBsdWdpbicsXHJcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyOiBWaXRlRGV2U2VydmVyKSB7XHJcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmF3ID0gcmVxLmhlYWRlcnNbJ3VzZXItYWdlbnQnXT8ubWF0Y2goL0Nocm9tKGV8aXVtKVxcLyhbMC05XSspXFwuLyk7XHJcblxyXG4gICAgICAgIGlmIChyYXcpIHtcclxuICAgICAgICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUludChyYXdbMl0sIDEwKTtcclxuXHJcbiAgICAgICAgICBpZiAodmVyc2lvbiA9PT0gMTI5KSB7XHJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L2h0bWwnKTtcclxuICAgICAgICAgICAgcmVzLmVuZChcclxuICAgICAgICAgICAgICAnPGJvZHk+PGgxPlBsZWFzZSB1c2UgQ2hyb21lIENhbmFyeSBmb3IgdGVzdGluZy48L2gxPjxwPkNocm9tZSAxMjkgaGFzIGFuIGlzc3VlIHdpdGggSmF2YVNjcmlwdCBtb2R1bGVzICYgVml0ZSBsb2NhbCBkZXZlbG9wbWVudCwgc2VlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vc3RhY2tibGl0ei9ib2x0Lm5ldy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTIzOTU1MTkyNThcIj5mb3IgbW9yZSBpbmZvcm1hdGlvbi48L2E+PC9wPjxwPjxiPk5vdGU6PC9iPiBUaGlzIG9ubHkgaW1wYWN0cyA8dT5sb2NhbCBkZXZlbG9wbWVudDwvdT4uIGBwbnBtIHJ1biBidWlsZGAgYW5kIGBwbnBtIHJ1biBzdGFydGAgd2lsbCB3b3JrIGZpbmUgaW4gdGhpcyBicm93c2VyLjwvcD48L2JvZHk+JyxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRWLFNBQVMsY0FBYyx1QkFBdUI7QUFDMVksU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxZQUFZO0FBQ25CLFNBQVMsb0JBQXdDO0FBQ2pELFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsMEJBQTBCO0FBQ25DLE9BQU8sbUJBQW1CO0FBQzFCLFlBQVksWUFBWTtBQUVqQixjQUFPO0FBRWQsSUFBTyw2QkFBUSxhQUFhLENBQUNBLFlBQVc7QUFDdEMsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sd0JBQXdCLEtBQUssVUFBVSxRQUFRLElBQUksUUFBUTtBQUFBLElBQzdEO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxVQUFVLENBQUMsUUFBUTtBQUFBLE1BQ25CLFlBQVksQ0FBQztBQUFBLElBQ2Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLGNBQWM7QUFBQTtBQUFBLFlBRVosZ0JBQWdCLENBQUMsU0FBUyxXQUFXO0FBQUEsWUFDckMsYUFBYSxDQUFDLDBCQUEwQixpQ0FBaUMseUJBQXlCO0FBQUEsWUFDbEcscUJBQXFCLENBQUMsb0JBQW9CLHFCQUFxQixzQkFBc0I7QUFBQSxZQUNyRixhQUFhLENBQUMsTUFBTSxrQkFBa0IsbUJBQW1CO0FBQUEsWUFDekQsZ0JBQWdCLENBQUMsWUFBWSxpQkFBaUI7QUFBQSxZQUM5QyxnQkFBZ0IsQ0FBQyxPQUFPO0FBQUEsVUFDMUI7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsdUJBQXVCO0FBQUE7QUFBQSxJQUN6QjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsY0FBYztBQUFBLFFBQ1osU0FBUyxDQUFDLFVBQVUsV0FBVyxRQUFRLFFBQVE7QUFBQSxRQUMvQyxTQUFTO0FBQUEsVUFDUCxRQUFRO0FBQUEsVUFDUixTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0EsaUJBQWlCO0FBQUEsUUFDakIsU0FBUztBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNEO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixVQUFVLE1BQU0sSUFBSTtBQUNsQixjQUFJLEdBQUcsU0FBUyxTQUFTLEdBQUc7QUFDMUIsbUJBQU87QUFBQSxjQUNMLE1BQU07QUFBQSxFQUNsQixJQUFJO0FBQUEsY0FDUSxLQUFLO0FBQUEsWUFDUDtBQUFBLFVBQ0Y7QUFFQSxpQkFBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sVUFBVSxJQUFJLFVBQVU7QUFFdEIsY0FBSSxPQUFPLFlBQVksR0FBRyxXQUFXLE9BQU8sS0FBSyxHQUFHLFdBQVcsWUFBWSxHQUFHO0FBQzVFLG1CQUFPLEVBQUUsSUFBSSxVQUFVLEtBQUs7QUFBQSxVQUM5QjtBQUdBLGNBQUksWUFBWSxTQUFTLFNBQVMsUUFBUSxHQUFHO0FBQzNDLGdCQUFJLEdBQUcsV0FBVyxPQUFPLEtBQUssQ0FBQyxRQUFRLFVBQVUsTUFBTSxRQUFRLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRztBQUNqRixxQkFBTyxFQUFFLElBQUksVUFBVSxLQUFLO0FBQUEsWUFDOUI7QUFBQSxVQUNGO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxnQkFBZ0I7QUFBQSxRQUNkLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFBQSxRQUN4QixRQUFRO0FBQUEsVUFDTixtQkFBbUI7QUFBQSxVQUNuQixzQkFBc0I7QUFBQSxVQUN0QixxQkFBcUI7QUFBQSxVQUNyQix1QkFBdUI7QUFBQSxRQUN6QjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsT0FBTztBQUFBLE1BQ1AsY0FBYztBQUFBLE1BQ2QscUJBQXFCO0FBQUEsTUFDckJBLFFBQU8sU0FBUyxnQkFBZ0IsbUJBQW1CLEVBQUUsT0FBTyxRQUFRLENBQUM7QUFBQSxJQUN2RTtBQUFBLElBQ0EsV0FBVztBQUFBLE1BQ1Q7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsU0FBUyx1QkFBdUI7QUFDOUIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sZ0JBQWdCLFFBQXVCO0FBQ3JDLGFBQU8sWUFBWSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFDekMsY0FBTSxNQUFNLElBQUksUUFBUSxZQUFZLEdBQUcsTUFBTSwwQkFBMEI7QUFFdkUsWUFBSSxLQUFLO0FBQ1AsZ0JBQU0sVUFBVSxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFFbkMsY0FBSSxZQUFZLEtBQUs7QUFDbkIsZ0JBQUksVUFBVSxnQkFBZ0IsV0FBVztBQUN6QyxnQkFBSTtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBRUE7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUVBLGFBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogWyJjb25maWciXQp9Cg==
