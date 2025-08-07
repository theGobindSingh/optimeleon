/* eslint-disable no-console  -- init */
import { createOrStartDbContainer } from "@handlers/db";
import { createOrStartRedisContainer } from "@handlers/queue";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const main = async () => {
  console.log(await createOrStartDbContainer());
  console.log(await createOrStartRedisContainer());

  const nodeModulesPath = path.join(__dirname, "..", "..", "node_modules");
  // create directory if it does not exist
  if (!existsSync(nodeModulesPath)) {
    mkdirSync(nodeModulesPath, { recursive: true });
  }

  // check if node_modules/.temp/setup.tmp exists
  const tempSetupPath = path.join(nodeModulesPath, ".temp", "setup.tmp");
  if (existsSync(tempSetupPath)) return;

  execSync("pnpm run setup:db", { stdio: "inherit" });

  // create file node_modules/.temp/setup.tmp (tempSetupPath)
  const tempDir = path.dirname(tempSetupPath);
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
  writeFileSync(
    tempSetupPath,
    "This file is created to indicate that the setup has been run",
  );
};
void main();
