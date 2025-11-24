import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },

  ...pluginVue.configs["flat/essential"],

  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },

  // Configuração para ficheiros de teste: Resolve 'global is not defined'
  {
    files: ["**/*.test.js", "**/__tests__/*.js"],
    languageOptions: {
      globals: {
        ...globals.node, // Reconhece 'global'
        ...globals.browser,
        ...globals.jest,
      },
    },
  },

  {
    files: ["vite.config.js", "eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
