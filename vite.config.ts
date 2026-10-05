import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig } from "vite";

export default defineConfig({
  server: { forwardConsole: true },
  plugins: [
    enhancedImages(),
    sveltekit({ preprocess: vitePreprocess(), adapter: adapter() }),
  ],
});
