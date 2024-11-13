import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  compilerOptions: {
    runes: true,
  },
  vitePlugin: {
    dynamicCompileOptions({ filename }) {
      if (filename.includes("node_modules")) {
        return { runes: undefined }; // or false, check what works
      }
    },
  },

  kit: {
    adapter: adapter(),
  },
};

export default config;
