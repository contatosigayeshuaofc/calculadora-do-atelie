import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", ".pnpm-store/**", "coverage/**", "playwright-report/**", "test-results/**"],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
