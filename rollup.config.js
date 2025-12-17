import typescript from "@rollup/plugin-typescript";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

export default {
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: pkg.main,
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};
