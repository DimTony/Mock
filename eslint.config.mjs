import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Legacy ESLint configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Your custom rules
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    rules: {
      // Example custom rules:
      // semi: ["error", "always"],
      // quotes: ["error", "single"],
      "no-unused-vars": ["off"],
      // eqeqeq: ["error", "always"],
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off"
    },
  },
];

export default eslintConfig;
