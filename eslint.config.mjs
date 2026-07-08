import parser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      // TypeScript rules — warn first, upgrade to error later
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-as-const": "warn",

      // React hooks — critical for correctness
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // React — off since react plugin isn't loaded (TypeScript parser handles JSX)
      "react/display-name": "off",
      "react/prop-types": "off",

      // General — warn to avoid breaking the build
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-unused-vars": "off", // handled by @typescript-eslint/no-unused-vars
      "no-empty": "warn",
      "no-case-declarations": "off",
      "no-fallthrough": "off", // common in React pattern matching
      "no-redeclare": "off", // handled by TypeScript
      "no-undef": "off", // handled by TypeScript
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "examples/**",
      "skills/**",
      "commands/**",
      "e2e/**",
      "playwright.config.ts",
      "vitest.config.ts",
      "vitest.setup.ts",
      "src/**/*.{test,spec}.{ts,tsx}",
    ],
  },
];

export default eslintConfig;
