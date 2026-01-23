// @ts-check
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Global ignores for build output and dependencies
  {
    ignores: ["node_modules/", "dist/"],
  },
  
  // Base configuration for all files
  js.configs.recommended,

  // Configuration for TypeScript files
  {
    files: ["**/*.ts"],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic, // Optional but recommended for style rules
    ],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  }
);

//  "dev": "nodemon --watch src --ext ts --exec \"npm run lint && ts-node src/server.ts\""