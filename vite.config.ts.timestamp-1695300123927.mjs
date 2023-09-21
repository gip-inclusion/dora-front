// vite.config.ts
import { sveltekit } from "file:///Users/alexandre-cantin/Desktop/dora-front/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig, loadEnv } from "file:///Users/alexandre-cantin/Desktop/dora-front/node_modules/vite/dist/node/index.js";
import { sentrySvelteKit } from "file:///Users/alexandre-cantin/Desktop/dora-front/node_modules/@sentry/sveltekit/cjs/index.server.js";
var vite_config_default = defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [
      sentrySvelteKit({
        sourceMapsUploadOptions: {
          telemetry: false
        }
      }),
      sveltekit()
    ],
    build: {
      sourcemap: true
    },
    test: {
      include: ["src/**/*.{test,spec}.{js,ts}"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWxleGFuZHJlLWNhbnRpbi9EZXNrdG9wL2RvcmEtZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hbGV4YW5kcmUtY2FudGluL0Rlc2t0b3AvZG9yYS1mcm9udC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWxleGFuZHJlLWNhbnRpbi9EZXNrdG9wL2RvcmEtZnJvbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tIFwiQHN2ZWx0ZWpzL2tpdC92aXRlXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgc2VudHJ5U3ZlbHRlS2l0IH0gZnJvbSBcIkBzZW50cnkvc3ZlbHRla2l0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gQ2hhcmdlIGxlcyB2YXJpYWJsZXMgZCdlbnZpcm9ubmVtZW50IGRlcyBmaWNoaWVycyAuZW52XG4gIHByb2Nlc3MuZW52ID0geyAuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKSB9O1xuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHNlbnRyeVN2ZWx0ZUtpdCh7XG4gICAgICAgIHNvdXJjZU1hcHNVcGxvYWRPcHRpb25zOiB7XG4gICAgICAgICAgdGVsZW1ldHJ5OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgc3ZlbHRla2l0KCksXG4gICAgXSxcblxuICAgIGJ1aWxkOiB7XG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgfSxcblxuICAgIHRlc3Q6IHtcbiAgICAgIGluY2x1ZGU6IFtcInNyYy8qKi8qLnt0ZXN0LHNwZWN9Lntqcyx0c31cIl0sXG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxTQUFTLGlCQUFpQjtBQUMxVSxTQUFTLGNBQWMsZUFBZTtBQUN0QyxTQUFTLHVCQUF1QjtBQUVoQyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxVQUFRLE1BQU0sRUFBRSxHQUFHLFFBQVEsS0FBSyxHQUFHLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQyxFQUFFO0FBQ2hFLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLGdCQUFnQjtBQUFBLFFBQ2QseUJBQXlCO0FBQUEsVUFDdkIsV0FBVztBQUFBLFFBQ2I7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFFQSxPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsSUFDYjtBQUFBLElBRUEsTUFBTTtBQUFBLE1BQ0osU0FBUyxDQUFDLDhCQUE4QjtBQUFBLElBQzFDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
