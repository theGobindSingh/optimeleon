import { commonConfig } from "@optimeleon/rollup";

const outputFolder = "dist";

/** @type {import("rollup").RollupOptions} */
const config = {
  ...commonConfig({
    tsConfigOpts: {
      outDir: outputFolder,
    },
  }),
  input: "src/index.ts",
  output: [
    {
      file: `${outputFolder}/index.mjs`,
      format: "esm",
      interop: "auto",
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: `${outputFolder}/index.cjs`,
      format: "cjs",
      interop: "auto",
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
};

export default config;
