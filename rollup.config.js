import typescript from "@rollup/plugin-typescript";

export default {
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: "lib/min-vue.cjs.js",
      sourcemap: true,
    },
    {
      file: "lib/min-vue.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};
