import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript","standard","plugin:tailwindcss/recommended","prettier"),
  "plugin:@typescript-eslint/recommended",
  "plugin:react-hooks/recommended",
  "plugin:react/recommended",
  "plugin:react/recommended",
  "plugin:react/jsx-runtime",
  "plugin:react-hooks/recommended",
];

export default eslintConfig;
