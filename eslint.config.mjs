import { defineConfig } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
  {
    ignores: [".next/**/*", "dist/**/*", "node_modules/**/*"]
  },
  ...next,
]);

