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
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@radix-ui")) {
                return "ui-vendor";
              }
              if (id.includes("@codemirror")) {
                return "codemirror-vendor";
              }
              if (id.includes("ai") || id.includes("@ai-sdk")) {
                return "ai-vendor";
              }
              if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
                return "chart-vendor";
              }
              if (id.includes("shiki")) {
                return "shiki-vendor";
              }
              if (id.includes("react") && !id.includes("react-chartjs-2")) {
                return "react-vendor";
              }
            }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudmVyY2VsLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYWRkeVxcXFxWaWRlb3NcXFxcYm9sdC5kaXktbWFpblxcXFxib2x0LmRpeS1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhZGR5XFxcXFZpZGVvc1xcXFxib2x0LmRpeS1tYWluXFxcXGJvbHQuZGl5LW1haW5cXFxcdml0ZS5jb25maWcudmVyY2VsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hZGR5L1ZpZGVvcy9ib2x0LmRpeS1tYWluL2JvbHQuZGl5LW1haW4vdml0ZS5jb25maWcudmVyY2VsLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peFZpdGVQbHVnaW4gfSBmcm9tICdAcmVtaXgtcnVuL2Rldic7XHJcbmltcG9ydCB7IHZlcmNlbFByZXNldCB9IGZyb20gJ0B2ZXJjZWwvcmVtaXgvdml0ZSc7XHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgVml0ZURldlNlcnZlciB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnO1xyXG5pbXBvcnQgeyBvcHRpbWl6ZUNzc01vZHVsZXMgfSBmcm9tICd2aXRlLXBsdWdpbi1vcHRpbWl6ZS1jc3MtbW9kdWxlcyc7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xyXG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcclxuXHJcbmRvdGVudi5jb25maWcoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoY29uZmlnKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGRlZmluZToge1xyXG4gICAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5OT0RFX0VOViksXHJcbiAgICB9LFxyXG4gICAgc3NyOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbJ3VuZGljaSddLFxyXG4gICAgICBub0V4dGVybmFsOiBbXSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgICBvdXREaXI6ICdidWlsZC9jbGllbnQnLCAvLyBWZXJjZWwgZXhwZWN0cyB0aGUgYnVpbGQgb3V0cHV0IGluIHRoaXMgZGlyZWN0b3J5XHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBleHRlcm5hbDogW1xyXG4gICAgICAgICAgJ2NoaWxkX3Byb2Nlc3MnLCBcclxuICAgICAgICAgICdmcycsIFxyXG4gICAgICAgICAgJ29zJywgXHJcbiAgICAgICAgICAncGF0aCcsIFxyXG4gICAgICAgICAgJ2NyeXB0bycsIFxyXG4gICAgICAgICAgJ3V0aWwnLFxyXG4gICAgICAgICAgJ3VuZGljaScsXHJcbiAgICAgICAgICAnbm9kZToqJyxcclxuICAgICAgICAgIC9ebm9kZTovXHJcbiAgICAgICAgXSxcclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgICAvLyBPbmx5IGNodW5rIG1vZHVsZXMgdGhhdCBhcmVuJ3QgZXh0ZXJuYWxpemVkXHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0ByYWRpeC11aScpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3VpLXZlbmRvcic7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQGNvZGVtaXJyb3InKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdjb2RlbWlycm9yLXZlbmRvcic7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnYWknKSB8fCBpZC5pbmNsdWRlcygnQGFpLXNkaycpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2FpLXZlbmRvcic7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnY2hhcnQuanMnKSB8fCBpZC5pbmNsdWRlcygncmVhY3QtY2hhcnRqcy0yJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnY2hhcnQtdmVuZG9yJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdzaGlraScpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3NoaWtpLXZlbmRvcic7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QnKSAmJiAhaWQuaW5jbHVkZXMoJ3JlYWN0LWNoYXJ0anMtMicpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3JlYWN0LXZlbmRvcic7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCwgLy8gSW5jcmVhc2Ugd2FybmluZyBsaW1pdCB0byAxTUJcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIG5vZGVQb2x5ZmlsbHMoe1xyXG4gICAgICAgIGluY2x1ZGU6IFsnYnVmZmVyJywgJ3Byb2Nlc3MnLCAndXRpbCcsICdzdHJlYW0nXSxcclxuICAgICAgICBnbG9iYWxzOiB7XHJcbiAgICAgICAgICBCdWZmZXI6IHRydWUsXHJcbiAgICAgICAgICBwcm9jZXNzOiB0cnVlLFxyXG4gICAgICAgICAgZ2xvYmFsOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJvdG9jb2xJbXBvcnRzOiB0cnVlLFxyXG4gICAgICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgICAgICdjaGlsZF9wcm9jZXNzJywgXHJcbiAgICAgICAgICAnZnMnLCBcclxuICAgICAgICAgICdjcnlwdG8nLCBcclxuICAgICAgICAgICdwYXRoJywgXHJcbiAgICAgICAgICAndW5kaWNpJyxcclxuICAgICAgICAgICdub2RlOionXHJcbiAgICAgICAgXSxcclxuICAgICAgfSksXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYnVmZmVyLXBvbHlmaWxsJyxcclxuICAgICAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZW52Lm1qcycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgY29kZTogYGltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XHJcbiR7Y29kZX1gLFxyXG4gICAgICAgICAgICAgIG1hcDogbnVsbCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2V4dGVybmFsaXplLW5vZGUtbW9kdWxlcycsXHJcbiAgICAgICAgcmVzb2x2ZUlkKGlkLCBpbXBvcnRlcikge1xyXG4gICAgICAgICAgLy8gRXh0ZXJuYWxpemUgdW5kaWNpIGFuZCBhbGwgbm9kZTogaW1wb3J0c1xyXG4gICAgICAgICAgaWYgKGlkID09PSAndW5kaWNpJyB8fCBpZC5zdGFydHNXaXRoKCdub2RlOicpIHx8IGlkLnN0YXJ0c1dpdGgoJ3V0aWwvdHlwZXMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBpZCwgZXh0ZXJuYWw6IHRydWUgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBiZWluZyBpbXBvcnRlZCBmcm9tIHVuZGljaSwgZXh0ZXJuYWxpemUgaXRcclxuICAgICAgICAgIGlmIChpbXBvcnRlciAmJiBpbXBvcnRlci5pbmNsdWRlcygndW5kaWNpJykpIHtcclxuICAgICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoJ25vZGU6JykgfHwgWyd1dGlsJywgJ2NyeXB0bycsICdmcycsICdwYXRoJywgJ29zJ10uaW5jbHVkZXMoaWQpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHsgaWQsIGV4dGVybmFsOiB0cnVlIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgLy8gUmVtb3ZlZCByZW1peENsb3VkZmxhcmVEZXZQcm94eSgpIGZvciBWZXJjZWwgZGVwbG95bWVudFxyXG4gICAgICByZW1peFZpdGVQbHVnaW4oe1xyXG4gICAgICAgIHByZXNldHM6IFt2ZXJjZWxQcmVzZXQoKV0sXHJcbiAgICAgICAgZnV0dXJlOiB7XHJcbiAgICAgICAgICB2M19mZXRjaGVyUGVyc2lzdDogdHJ1ZSxcclxuICAgICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxyXG4gICAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcclxuICAgICAgICAgIHYzX2xhenlSb3V0ZURpc2NvdmVyeTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgICAgVW5vQ1NTKCksXHJcbiAgICAgIHRzY29uZmlnUGF0aHMoKSxcclxuICAgICAgY2hyb21lMTI5SXNzdWVQbHVnaW4oKSxcclxuICAgICAgY29uZmlnLm1vZGUgPT09ICdwcm9kdWN0aW9uJyAmJiBvcHRpbWl6ZUNzc01vZHVsZXMoeyBhcHBseTogJ2J1aWxkJyB9KSxcclxuICAgIF0sXHJcbiAgICBlbnZQcmVmaXg6IFtcclxuICAgICAgJ1ZJVEVfJyxcclxuICAgICAgJ09QRU5BSV9MSUtFX0FQSV9CQVNFX1VSTCcsXHJcbiAgICAgICdPTExBTUFfQVBJX0JBU0VfVVJMJyxcclxuICAgICAgJ0xNU1RVRElPX0FQSV9CQVNFX1VSTCcsXHJcbiAgICAgICdUT0dFVEhFUl9BUElfQkFTRV9VUkwnLFxyXG4gICAgXSxcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIC8vIEFkZCBWZXJjZWwtc3BlY2lmaWMgc2VydmVyIGNvbmZpZ3VyYXRpb25cclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiAzMDAwLFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGNocm9tZTEyOUlzc3VlUGx1Z2luKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiAnY2hyb21lMTI5SXNzdWVQbHVnaW4nLFxyXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogVml0ZURldlNlcnZlcikge1xyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJhdyA9IHJlcS5oZWFkZXJzWyd1c2VyLWFnZW50J10/Lm1hdGNoKC9DaHJvbShlfGl1bSlcXC8oWzAtOV0rKVxcLi8pO1xyXG5cclxuICAgICAgICBpZiAocmF3KSB7XHJcbiAgICAgICAgICBjb25zdCB2ZXJzaW9uID0gcGFyc2VJbnQocmF3WzJdLCAxMCk7XHJcblxyXG4gICAgICAgICAgaWYgKHZlcnNpb24gPT09IDEyOSkge1xyXG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAndGV4dC9odG1sJyk7XHJcbiAgICAgICAgICAgIHJlcy5lbmQoXHJcbiAgICAgICAgICAgICAgJzxib2R5PjxoMT5QbGVhc2UgdXNlIENocm9tZSBDYW5hcnkgZm9yIHRlc3RpbmcuPC9oMT48cD5DaHJvbWUgMTI5IGhhcyBhbiBpc3N1ZSB3aXRoIEphdmFTY3JpcHQgbW9kdWxlcyAmIFZpdGUgbG9jYWwgZGV2ZWxvcG1lbnQsIHNlZSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3N0YWNrYmxpdHovYm9sdC5uZXcvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0yMzk1NTE5MjU4XCI+Zm9yIG1vcmUgaW5mb3JtYXRpb24uPC9hPjwvcD48cD48Yj5Ob3RlOjwvYj4gVGhpcyBvbmx5IGltcGFjdHMgPHU+bG9jYWwgZGV2ZWxvcG1lbnQ8L3U+LiBgcG5wbSBydW4gYnVpbGRgIGFuZCBgcG5wbSBydW4gc3RhcnRgIHdpbGwgd29yayBmaW5lIGluIHRoaXMgYnJvd3Nlci48L3A+PC9ib2R5PicsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICB9O1xyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VixTQUFTLGNBQWMsdUJBQXVCO0FBQzFZLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sWUFBWTtBQUNuQixTQUFTLG9CQUF3QztBQUNqRCxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLDBCQUEwQjtBQUNuQyxPQUFPLG1CQUFtQjtBQUMxQixZQUFZLFlBQVk7QUFFakIsY0FBTztBQUVkLElBQU8sNkJBQVEsYUFBYSxDQUFDQSxZQUFXO0FBQ3RDLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLHdCQUF3QixL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
