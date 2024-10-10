import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import drizzlePlugin from "eslint-plugin-drizzle";
import eslintPrettierConfig from "eslint-config-prettier";
import { fixupPluginRules } from "@eslint/compat";

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
