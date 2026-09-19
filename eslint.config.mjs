import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Phase parity keeps the exact crop/layout behavior of the approved HTML.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "public/**", "reference-html/**", "assets/**", "supabase/.temp/**"]),
]);
