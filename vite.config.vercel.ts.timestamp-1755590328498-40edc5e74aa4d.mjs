// vite.config.vercel.ts
import { vitePlugin as remixVitePlugin } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/@remix-run+dev@2.16.8_@remix-run+react@2.16.8_react-dom@18.3.1_react@18.3.1__react@18.3.1_typ_lbtdubaugtdkap2z4uwe5ip36q/node_modules/@remix-run/dev/dist/index.js";
import { vercelPreset } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/@vercel+remix@2.16.7_@remix-run+dev@2.16.8_@remix-run+react@2.16.8_react-dom@18.3.1_react@18._c6dukbcwxxzbtydvg6ovcgbuda/node_modules/@vercel/remix/vite.js";
import UnoCSS from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/unocss@0.61.9_postcss@8.5.6_rollup@4.45.1_vite@5.4.19_@types+node@24.3.0_sass-embedded@1.89.2_/node_modules/unocss/dist/vite.mjs";
import { defineConfig } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/vite@5.4.19_@types+node@24.3.0_sass-embedded@1.89.2/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/vite-plugin-node-polyfills@0.22.0_rollup@4.45.1_vite@5.4.19_@types+node@24.3.0_sass-embedded@1.89.2_/node_modules/vite-plugin-node-polyfills/dist/index.js";
import { optimizeCssModules } from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/vite-plugin-optimize-css-modules@1.2.0_vite@5.4.19_@types+node@24.3.0_sass-embedded@1.89.2_/node_modules/vite-plugin-optimize-css-modules/dist/index.mjs";
import tsconfigPaths from "file:///C:/Users/addy/Videos/bolt.diy-main/bolt.diy-main/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.8.3_vite@5.4.19_@types+node@24.3.0_sass-embedded@1.89.2_/node_modules/vite-tsconfig-paths/dist/index.mjs";
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
          "util/types",
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
          if (id === "undici" || id.startsWith("node:")) {
            return { id, external: true };
          }
          if (id === "util/types" || id.endsWith("/util/types")) {
            return { id: "node:util/types", external: true };
          }
          if (importer && importer.includes("undici")) {
            if (id.startsWith("node:") || ["util", "crypto", "fs", "path", "os", "util/types"].includes(id)) {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudmVyY2VsLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYWRkeVxcXFxWaWRlb3NcXFxcYm9sdC5kaXktbWFpblxcXFxib2x0LmRpeS1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhZGR5XFxcXFZpZGVvc1xcXFxib2x0LmRpeS1tYWluXFxcXGJvbHQuZGl5LW1haW5cXFxcdml0ZS5jb25maWcudmVyY2VsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hZGR5L1ZpZGVvcy9ib2x0LmRpeS1tYWluL2JvbHQuZGl5LW1haW4vdml0ZS5jb25maWcudmVyY2VsLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peFZpdGVQbHVnaW4gfSBmcm9tICdAcmVtaXgtcnVuL2Rldic7XG5pbXBvcnQgeyB2ZXJjZWxQcmVzZXQgfSBmcm9tICdAdmVyY2VsL3JlbWl4L3ZpdGUnO1xuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgVml0ZURldlNlcnZlciB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLW5vZGUtcG9seWZpbGxzJztcbmltcG9ydCB7IG9wdGltaXplQ3NzTW9kdWxlcyB9IGZyb20gJ3ZpdGUtcGx1Z2luLW9wdGltaXplLWNzcy1tb2R1bGVzJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuaW1wb3J0ICogYXMgZG90ZW52IGZyb20gJ2RvdGVudic7XG5cbmRvdGVudi5jb25maWcoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKChjb25maWcpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBkZWZpbmU6IHtcbiAgICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lk5PREVfRU5WKSxcbiAgICB9LFxuICAgIHNzcjoge1xuICAgICAgZXh0ZXJuYWw6IFsndW5kaWNpJ10sXG4gICAgICBub0V4dGVybmFsOiBbXSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgICAgb3V0RGlyOiAnYnVpbGQvY2xpZW50JywgLy8gVmVyY2VsIGV4cGVjdHMgdGhlIGJ1aWxkIG91dHB1dCBpbiB0aGlzIGRpcmVjdG9yeVxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBleHRlcm5hbDogW1xuICAgICAgICAgICdjaGlsZF9wcm9jZXNzJywgXG4gICAgICAgICAgJ2ZzJywgXG4gICAgICAgICAgJ29zJywgXG4gICAgICAgICAgJ3BhdGgnLCBcbiAgICAgICAgICAnY3J5cHRvJywgXG4gICAgICAgICAgJ3V0aWwnLFxuICAgICAgICAgICd1dGlsL3R5cGVzJyxcbiAgICAgICAgICAndW5kaWNpJyxcbiAgICAgICAgICAnbm9kZToqJyxcbiAgICAgICAgICAvXm5vZGU6L1xuICAgICAgICBdLFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICAgIC8vIE9ubHkgY2h1bmsgbW9kdWxlcyB0aGF0IGFyZW4ndCBleHRlcm5hbGl6ZWRcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAcmFkaXgtdWknKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAndWktdmVuZG9yJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0Bjb2RlbWlycm9yJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2NvZGVtaXJyb3ItdmVuZG9yJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2FpJykgfHwgaWQuaW5jbHVkZXMoJ0BhaS1zZGsnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnYWktdmVuZG9yJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2NoYXJ0LmpzJykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LWNoYXJ0anMtMicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdjaGFydC12ZW5kb3InO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnc2hpa2knKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnc2hpa2ktdmVuZG9yJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0JykgJiYgIWlkLmluY2x1ZGVzKCdyZWFjdC1jaGFydGpzLTInKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAncmVhY3QtdmVuZG9yJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLCAvLyBJbmNyZWFzZSB3YXJuaW5nIGxpbWl0IHRvIDFNQlxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgbm9kZVBvbHlmaWxscyh7XG4gICAgICAgIGluY2x1ZGU6IFsnYnVmZmVyJywgJ3Byb2Nlc3MnLCAndXRpbCcsICdzdHJlYW0nXSxcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIEJ1ZmZlcjogdHJ1ZSxcbiAgICAgICAgICBwcm9jZXNzOiB0cnVlLFxuICAgICAgICAgIGdsb2JhbDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgcHJvdG9jb2xJbXBvcnRzOiB0cnVlLFxuICAgICAgICBleGNsdWRlOiBbXG4gICAgICAgICAgJ2NoaWxkX3Byb2Nlc3MnLCBcbiAgICAgICAgICAnZnMnLCBcbiAgICAgICAgICAnY3J5cHRvJywgXG4gICAgICAgICAgJ3BhdGgnLCBcbiAgICAgICAgICAndW5kaWNpJyBhcyBhbnksXG4gICAgICAgICAgJ25vZGU6KicgYXMgYW55XG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2J1ZmZlci1wb2x5ZmlsbCcsXG4gICAgICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZW52Lm1qcycpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBjb2RlOiBgaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJztcbiR7Y29kZX1gLFxuICAgICAgICAgICAgICBtYXA6IG51bGwsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2V4dGVybmFsaXplLW5vZGUtbW9kdWxlcycsXG4gICAgICAgIHJlc29sdmVJZChpZCwgaW1wb3J0ZXIpIHtcbiAgICAgICAgICAvLyBFeHRlcm5hbGl6ZSB1bmRpY2kgYW5kIGFsbCBub2RlOiBpbXBvcnRzXG4gICAgICAgICAgaWYgKGlkID09PSAndW5kaWNpJyB8fCBpZC5zdGFydHNXaXRoKCdub2RlOicpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBpZCwgZXh0ZXJuYWw6IHRydWUgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gSGFuZGxlIHV0aWwvdHlwZXMgc3BlY2lmaWNhbGx5XG4gICAgICAgICAgaWYgKGlkID09PSAndXRpbC90eXBlcycgfHwgaWQuZW5kc1dpdGgoJy91dGlsL3R5cGVzJykpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGlkOiAnbm9kZTp1dGlsL3R5cGVzJywgZXh0ZXJuYWw6IHRydWUgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gSWYgdGhpcyBpcyBiZWluZyBpbXBvcnRlZCBmcm9tIHVuZGljaSwgZXh0ZXJuYWxpemUgaXRcbiAgICAgICAgICBpZiAoaW1wb3J0ZXIgJiYgaW1wb3J0ZXIuaW5jbHVkZXMoJ3VuZGljaScpKSB7XG4gICAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aCgnbm9kZTonKSB8fCBbJ3V0aWwnLCAnY3J5cHRvJywgJ2ZzJywgJ3BhdGgnLCAnb3MnLCAndXRpbC90eXBlcyddLmluY2x1ZGVzKGlkKSkge1xuICAgICAgICAgICAgICByZXR1cm4geyBpZCwgZXh0ZXJuYWw6IHRydWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gUmVtb3ZlZCByZW1peENsb3VkZmxhcmVEZXZQcm94eSgpIGZvciBWZXJjZWwgZGVwbG95bWVudFxuICAgICAgcmVtaXhWaXRlUGx1Z2luKHtcbiAgICAgICAgcHJlc2V0czogW3ZlcmNlbFByZXNldCgpXSxcbiAgICAgICAgZnV0dXJlOiB7XG4gICAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG4gICAgICAgICAgdjNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXG4gICAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcbiAgICAgICAgICB2M19sYXp5Um91dGVEaXNjb3Zlcnk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFVub0NTUygpLFxuICAgICAgdHNjb25maWdQYXRocygpLFxuICAgICAgY2hyb21lMTI5SXNzdWVQbHVnaW4oKSxcbiAgICAgIGNvbmZpZy5tb2RlID09PSAncHJvZHVjdGlvbicgJiYgb3B0aW1pemVDc3NNb2R1bGVzKHsgYXBwbHk6ICdidWlsZCcgfSksXG4gICAgXSxcbiAgICBlbnZQcmVmaXg6IFtcbiAgICAgICdWSVRFXycsXG4gICAgICAnT1BFTkFJX0xJS0VfQVBJX0JBU0VfVVJMJyxcbiAgICAgICdPTExBTUFfQVBJX0JBU0VfVVJMJyxcbiAgICAgICdMTVNUVURJT19BUElfQkFTRV9VUkwnLFxuICAgICAgJ1RPR0VUSEVSX0FQSV9CQVNFX1VSTCcsXG4gICAgXSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gQWRkIFZlcmNlbC1zcGVjaWZpYyBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogMzAwMCxcbiAgICB9LFxuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGNocm9tZTEyOUlzc3VlUGx1Z2luKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjaHJvbWUxMjlJc3N1ZVBsdWdpbicsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogVml0ZURldlNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgY29uc3QgcmF3ID0gcmVxLmhlYWRlcnNbJ3VzZXItYWdlbnQnXT8ubWF0Y2goL0Nocm9tKGV8aXVtKVxcLyhbMC05XSspXFwuLyk7XG5cbiAgICAgICAgaWYgKHJhdykge1xuICAgICAgICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUludChyYXdbMl0sIDEwKTtcblxuICAgICAgICAgIGlmICh2ZXJzaW9uID09PSAxMjkpIHtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L2h0bWwnKTtcbiAgICAgICAgICAgIHJlcy5lbmQoXG4gICAgICAgICAgICAgICc8Ym9keT48aDE+UGxlYXNlIHVzZSBDaHJvbWUgQ2FuYXJ5IGZvciB0ZXN0aW5nLjwvaDE+PHA+Q2hyb21lIDEyOSBoYXMgYW4gaXNzdWUgd2l0aCBKYXZhU2NyaXB0IG1vZHVsZXMgJiBWaXRlIGxvY2FsIGRldmVsb3BtZW50LCBzZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdGFja2JsaXR6L2JvbHQubmV3L2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMjM5NTUxOTI1OFwiPmZvciBtb3JlIGluZm9ybWF0aW9uLjwvYT48L3A+PHA+PGI+Tm90ZTo8L2I+IFRoaXMgb25seSBpbXBhY3RzIDx1PmxvY2FsIGRldmVsb3BtZW50PC91Pi4gYHBucG0gcnVuIGJ1aWxkYCBhbmQgYHBucG0gcnVuIHN0YXJ0YCB3aWxsIHdvcmsgZmluZSBpbiB0aGlzIGJyb3dzZXIuPC9wPjwvYm9keT4nLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VixTQUFTLGNBQWMsdUJBQXVCO0FBQzFZLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sWUFBWTtBQUNuQixTQUFTLG9CQUF3QztBQUNqRCxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLDBCQUEwQjtBQUNuQyxPQUFPLG1CQUFtQjtBQUMxQixZQUFZLFlBQVk7QUFFakIsY0FBTztBQUVkLElBQU8sNkJBQVEsYUFBYSxDQUFDQSxZQUFXO0FBQ3RDLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLHdCQUF3QixLQUFLLFVBQVUsUUFBUSxJQUFJLFFBQVE7QUFBQSxJQUM3RDtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsVUFBVSxDQUFDLFFBQVE7QUFBQSxNQUNuQixZQUFZLENBQUM7QUFBQSxJQUNmO0FBQUEsSUFDQSxPQUFPO0FB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
