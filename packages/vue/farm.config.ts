import { defineConfig } from '@farmfe/core';
export default defineConfig({
  compilation: {
    input: {
      index: "./index.tsx"
    },
    output: {
      format: "esm",
      targetEnv: "library-browser",
    },
    external: [
      "@rxform/core",
      "vue",
    ],
    presetEnv: false,
    sourcemap: true,
  }
});
