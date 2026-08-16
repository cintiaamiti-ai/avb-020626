// eslint.config.js
// ESLint flat config (ESLint v9+)
// Dependências: eslint, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint-plugin-react-hooks

import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

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
      // Antes: uma lista de globals do browser mantida manualmente, faltando
      // itens como HTMLInputElement, HTMLTextAreaElement, CryptoKey e
      // SpeechSynthesisUtterance/Voice — o que gerava dezenas de falsos
      // positivos "is not defined" e escondia erros reais no meio do ruído.
      // Agora usamos o conjunto padrão `globals.browser`, que cobre o
      // ambiente de navegador de forma completa e é mantido pela comunidade.
      globals: {
        ...globals.browser,
        SpeechSynthesisVoice: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      // `no-undef` do ESLint não entende tipos usados apenas em posição de
      // tipo (ex.: `React.ComponentProps<...>` sem importar `React` como
      // valor — válido em TS moderno). O TypeScript (`tsc --noEmit`) já
      // verifica identificadores indefinidos com muito mais precisão, então
      // desativamos aqui para não gerar falsos positivos em arquivos .ts/.tsx.
      "no-undef": "off",

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
