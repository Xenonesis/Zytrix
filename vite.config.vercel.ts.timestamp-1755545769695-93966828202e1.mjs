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
    build: {
      target: "esnext",
      outDir: "build/client",
      // Vercel expects the build output in this directory
      rollupOptions: {
        external: ["child_process", "fs", "os", "path", "crypto", "util"],
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
        include: ["buffer", "process", "util", "stream", "crypto", "path"],
        globals: {
          Buffer: true,
          process: true,
          global: true
        },
        protocolImports: true,
        exclude: ["child_process", "fs"]
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudmVyY2VsLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYWRkeVxcXFxWaWRlb3NcXFxcYm9sdC5kaXktbWFpblxcXFxib2x0LmRpeS1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhZGR5XFxcXFZpZGVvc1xcXFxib2x0LmRpeS1tYWluXFxcXGJvbHQuZGl5LW1haW5cXFxcdml0ZS5jb25maWcudmVyY2VsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hZGR5L1ZpZGVvcy9ib2x0LmRpeS1tYWluL2JvbHQuZGl5LW1haW4vdml0ZS5jb25maWcudmVyY2VsLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peFZpdGVQbHVnaW4gfSBmcm9tICdAcmVtaXgtcnVuL2Rldic7XHJcbmltcG9ydCB7IHZlcmNlbFByZXNldCB9IGZyb20gJ0B2ZXJjZWwvcmVtaXgvdml0ZSc7XHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgVml0ZURldlNlcnZlciB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnO1xyXG5pbXBvcnQgeyBvcHRpbWl6ZUNzc01vZHVsZXMgfSBmcm9tICd2aXRlLXBsdWdpbi1vcHRpbWl6ZS1jc3MtbW9kdWxlcyc7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xyXG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcclxuXHJcbmRvdGVudi5jb25maWcoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoY29uZmlnKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGRlZmluZToge1xyXG4gICAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5OT0RFX0VOViksXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICAgICAgb3V0RGlyOiAnYnVpbGQvY2xpZW50JywgLy8gVmVyY2VsIGV4cGVjdHMgdGhlIGJ1aWxkIG91dHB1dCBpbiB0aGlzIGRpcmVjdG9yeVxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgZXh0ZXJuYWw6IFsnY2hpbGRfcHJvY2VzcycsICdmcycsICdvcycsICdwYXRoJywgJ2NyeXB0bycsICd1dGlsJ10sXHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgLy8gU3BsaXQgdmVuZG9yIGxpYnJhcmllcyBpbnRvIHNlcGFyYXRlIGNodW5rc1xyXG4gICAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgICAgICAgJ3VpLXZlbmRvcic6IFsnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsICdAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlciddLFxyXG4gICAgICAgICAgICAnY29kZW1pcnJvci12ZW5kb3InOiBbJ0Bjb2RlbWlycm9yL3ZpZXcnLCAnQGNvZGVtaXJyb3Ivc3RhdGUnLCAnQGNvZGVtaXJyb3IvbGFuZ3VhZ2UnXSxcclxuICAgICAgICAgICAgJ2FpLXZlbmRvcic6IFsnYWknLCAnQGFpLXNkay9vcGVuYWknLCAnQGFpLXNkay9hbnRocm9waWMnXSxcclxuICAgICAgICAgICAgJ2NoYXJ0LXZlbmRvcic6IFsnY2hhcnQuanMnLCAncmVhY3QtY2hhcnRqcy0yJ10sXHJcbiAgICAgICAgICAgICdzaGlraS12ZW5kb3InOiBbJ3NoaWtpJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCwgLy8gSW5jcmVhc2Ugd2FybmluZyBsaW1pdCB0byAxTUJcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIG5vZGVQb2x5ZmlsbHMoe1xyXG4gICAgICAgIGluY2x1ZGU6IFsnYnVmZmVyJywgJ3Byb2Nlc3MnLCAndXRpbCcsICdzdHJlYW0nLCAnY3J5cHRvJywgJ3BhdGgnXSxcclxuICAgICAgICBnbG9iYWxzOiB7XHJcbiAgICAgICAgICBCdWZmZXI6IHRydWUsXHJcbiAgICAgICAgICBwcm9jZXNzOiB0cnVlLFxyXG4gICAgICAgICAgZ2xvYmFsOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJvdG9jb2xJbXBvcnRzOiB0cnVlLFxyXG4gICAgICAgIGV4Y2x1ZGU6IFsnY2hpbGRfcHJvY2VzcycsICdmcyddLFxyXG4gICAgICB9KSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdidWZmZXItcG9seWZpbGwnLFxyXG4gICAgICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdlbnYubWpzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICBjb2RlOiBgaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJztcclxuJHtjb2RlfWAsXHJcbiAgICAgICAgICAgICAgbWFwOiBudWxsLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFJlbW92ZWQgcmVtaXhDbG91ZGZsYXJlRGV2UHJveHkoKSBmb3IgVmVyY2VsIGRlcGxveW1lbnRcclxuICAgICAgcmVtaXhWaXRlUGx1Z2luKHtcclxuICAgICAgICBwcmVzZXRzOiBbdmVyY2VsUHJlc2V0KCldLFxyXG4gICAgICAgIGZ1dHVyZToge1xyXG4gICAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXHJcbiAgICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcclxuICAgICAgICAgIHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXHJcbiAgICAgICAgICB2M19sYXp5Um91dGVEaXNjb3Zlcnk6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIFVub0NTUygpLFxyXG4gICAgICB0c2NvbmZpZ1BhdGhzKCksXHJcbiAgICAgIGNocm9tZTEyOUlzc3VlUGx1Z2luKCksXHJcbiAgICAgIGNvbmZpZy5tb2RlID09PSAncHJvZHVjdGlvbicgJiYgb3B0aW1pemVDc3NNb2R1bGVzKHsgYXBwbHk6ICdidWlsZCcgfSksXHJcbiAgICBdLFxyXG4gICAgZW52UHJlZml4OiBbXHJcbiAgICAgICdWSVRFXycsXHJcbiAgICAgICdPUEVOQUlfTElLRV9BUElfQkFTRV9VUkwnLFxyXG4gICAgICAnT0xMQU1BX0FQSV9CQVNFX1VSTCcsXHJcbiAgICAgICdMTVNUVURJT19BUElfQkFTRV9VUkwnLFxyXG4gICAgICAnVE9HRVRIRVJfQVBJX0JBU0VfVVJMJyxcclxuICAgIF0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICAvLyBBZGQgVmVyY2VsLXNwZWNpZmljIHNlcnZlciBjb25maWd1cmF0aW9uXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogMzAwMCxcclxuICAgIH0sXHJcbiAgfTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBjaHJvbWUxMjlJc3N1ZVBsdWdpbigpIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogJ2Nocm9tZTEyOUlzc3VlUGx1Z2luJyxcclxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXI6IFZpdGVEZXZTZXJ2ZXIpIHtcclxuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zdCByYXcgPSByZXEuaGVhZGVyc1sndXNlci1hZ2VudCddPy5tYXRjaCgvQ2hyb20oZXxpdW0pXFwvKFswLTldKylcXC4vKTtcclxuXHJcbiAgICAgICAgaWYgKHJhdykge1xyXG4gICAgICAgICAgY29uc3QgdmVyc2lvbiA9IHBhcnNlSW50KHJhd1syXSwgMTApO1xyXG5cclxuICAgICAgICAgIGlmICh2ZXJzaW9uID09PSAxMjkpIHtcclxuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ3RleHQvaHRtbCcpO1xyXG4gICAgICAgICAgICByZXMuZW5kKFxyXG4gICAgICAgICAgICAgICc8Ym9keT48aDE+UGxlYXNlIHVzZSBDaHJvbWUgQ2FuYXJ5IGZvciB0ZXN0aW5nLjwvaDE+PHA+Q2hyb21lIDEyOSBoYXMgYW4gaXNzdWUgd2l0aCBKYXZhU2NyaXB0IG1vZHVsZXMgJiBWaXRlIGxvY2FsIGRldmVsb3BtZW50LCBzZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdGFja2JsaXR6L2JvbHQubmV3L2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMjM5NTUxOTI1OFwiPmZvciBtb3JlIGluZm9ybWF0aW9uLjwvYT48L3A+PHA+PGI+Tm90ZTo8L2I+IFRoaXMgb25seSBpbXBhY3RzIDx1PmxvY2FsIGRldmVsb3BtZW50PC91Pi4gYHBucG0gcnVuIGJ1aWxkYCBhbmQgYHBucG0gcnVuIHN0YXJ0YCB3aWxsIHdvcmsgZmluZSBpbiB0aGlzIGJyb3dzZXIuPC9wPjwvYm9keT4nLFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgfTtcclxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFYsU0FBUyxjQUFjLHVCQUF1QjtBQUMxWSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFlBQVk7QUFDbkIsU0FBUyxvQkFBd0M7QUFDakQsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUywwQkFBMEI7QUFDbkMsT0FBTyxtQkFBbUI7QUFDMUIsWUFBWSxZQUFZO0FBRWpCLGNBQU87QUFFZCxJQUFPLDZCQUFRLGFBQWEsQ0FBQ0EsWUFBVztBQUN0QyxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTix3QkFBd0IsS0FBSyxVQUFVLFFBQVEsSUFBSSxRQUFRO0FBQUEsSUFDN0Q7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVSxDQUFDLGlCQUFpQixNQUFNLE1BQU0sUUFBUSxVQUFVLE1BQU07QUFBQSxRQUNoRSxRQUFRO0FBQUEsVUFDTixjQUFjO0FBQUE7QUFBQSxZQUVaLGdCQUFnQixDQUFDLFNBQVMsV0FBVztBQUFBLFlBQ3JDLGFBQWEsQ0FBQywwQkFBMEIsaUNBQWlDLHlCQUF5QjtBQUFBLFlBQ2xHLHFCQUFxQixDQUFDLG9CQUFvQixxQkFBcUIsc0JBQXNCO0FBQUEsWUFDckYsYUFBYSxDQUFDLE1BQU0sa0JBQWtCLG1CQUFtQjtBQUFBLFlBQ3pELGdCQUFnQixDQUFDLFlBQVksaUJBQWlCO0FBQUEsWUFDOUMsZ0JBQWdCLENBQUMsT0FBTztBQUFBLFVBQzFCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLHVCQUF1QjtBQUFBO0FBQUEsSUFDekI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLGNBQWM7QUFBQSxRQUNaLFNBQVMsQ0FBQyxVQUFVLFdBQVcsUUFBUSxVQUFVLFVBQVUsTUFBTTtBQUFBLFFBQ2pFLFNBQVM7QUFBQSxVQUNQLFFBQVE7QUFBQSxVQUNSLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQSxpQkFBaUI7QUFBQSxRQUNqQixTQUFTLENBQUMsaUJBQWlCLElBQUk7QUFBQSxNQUNqQyxDQUFDO0FBQUEsTUFDRDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sVUFBVSxNQUFNLElBQUk7QUFDbEIsY0FBSSxHQUFHLFNBQVMsU0FBUyxHQUFHO0FBQzFCLG1CQUFPO0FBQUEsY0FDTCxNQUFNO0FBQUEsRUFDbEIsSUFBSTtBQUFBLGNBQ1EsS0FBSztBQUFBLFlBQ1A7QUFBQSxVQUNGO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxnQkFBZ0I7QUFBQSxRQUNkLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFBQSxRQUN4QixRQUFRO0FBQUEsVUFDTixtQkFBbUI7QUFBQSxVQUNuQixzQkFBc0I7QUFBQSxVQUN0QixxQkFBcUI7QUFBQSxVQUNyQix1QkFBdUI7QUFBQSxRQUN6QjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsT0FBTztBQUFBLE1BQ1AsY0FBYztBQUFBLE1BQ2QscUJBQXFCO0FBQUEsTUFDckJBLFFBQU8sU0FBUyxnQkFBZ0IsbUJBQW1CLEVBQUUsT0FBTyxRQUFRLENBQUM7QUFBQSxJQUN2RTtBQUFBLElBQ0EsV0FBVztBQUFBLE1BQ1Q7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBRUQsU0FBUyx1QkFBdUI7QUFDOUIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sZ0JBQWdCLFFBQXVCO0FBQ3JDLGFBQU8sWUFBWSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFDekMsY0FBTSxNQUFNLElBQUksUUFBUSxZQUFZLEdBQUcsTUFBTSwwQkFBMEI7QUFFdkUsWUFBSSxLQUFLO0FBQ1AsZ0JBQU0sVUFBVSxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFFbkMsY0FBSSxZQUFZLEtBQUs7QUFDbkIsZ0JBQUksVUFBVSxnQkFBZ0IsV0FBVztBQUN6QyxnQkFBSTtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBRUE7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUVBLGFBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogWyJjb25maWciXQp9Cg==
