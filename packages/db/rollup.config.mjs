import { createLibraryBuildConfig } from "@optimeleon/rollup";

const outputFolder = "dist";

/** @type {import("rollup").RollupOptions[]} */
const config = createLibraryBuildConfig({
  name: "db",
  input: "src/index.ts",
  outputFolder,
  // tsConfigOpts: {
  //   paths: {
  //     "@p/*": ["./src/*"],
  //   },
  // },
});

export default config;
