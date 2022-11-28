import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode, ssrBuild }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    server: {
      host: process.env.HOST || "0.0.0.0",
      port: Number(process.env.PORT) || 4000,
      cors: true,
      watch: {
        usePolling: true,
      },
    },
  };
});
