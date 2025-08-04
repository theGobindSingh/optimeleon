import reactConfig from "./react.mjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...reactConfig,
  {
    settings: {
      next: {
        rootDir: ".",
      },
    },
  },
];
