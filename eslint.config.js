// eslint.config.js
// ESLint flat config (ESLint v9+)
// Dependências: eslint, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint-plugin-react-hooks

import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // ─── Ignorados ──────────────────────────────────────────────────────────────
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "*.config.js",
      "*.config.ts",
      "coverage/**",
    ],
  },

  // ─── Base JS ─────────────────────────────────────────────────────────────────
  js.configs.recommended,

  // ─── TypeScript + React ───────────────────────────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        crypto: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        AudioContext: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        fetch: "readonly",
        RequestInit: "readonly",
        Response: "readonly",
        Headers: "readonly",
        FormData: "readonly",
        Blob: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Uint8Array: "readonly",
        ArrayBuffer: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        btoa: "readonly",
        atob: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      // ─── TypeScript ──────────────────────────────────────────────────────────
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",

      // ─── React Hooks ─────────────────────────────────────────────────────────
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ─── Imports mortos ──────────────────────────────────────────────────────
      "no-unused-vars": "off", // desativado em favor do @typescript-eslint/no-unused-vars

      // ─── Qualidade geral ─────────────────────────────────────────────────────
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-duplicate-imports": "error",

      // ─── Acessibilidade inline (básico) ──────────────────────────────────────
      // Para regras completas de acessibilidade, adicione eslint-plugin-jsx-a11y
    },
  },
];
