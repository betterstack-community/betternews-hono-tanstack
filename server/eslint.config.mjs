import { fixupPluginRules } from "@eslint/compat";
import pluginJs from "@eslint/js";
import eslintPrettierConfig from "eslint-config-prettier";
import drizzlePlugin from "eslint-plugin-drizzle";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPrettierConfig,
  {
    plugins: {
      drizzle: fixupPluginRules(drizzlePlugin),
    },
  },
];
