import { Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";
import { getProject, getScript } from "src/prisma";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getScriptHandler = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).send("Project ID is required");
  }
  res.setHeader("Content-Type", "application/javascript");
  const script = await getScript(projectId);
  if (!script) {
    return res.status(404).send("Script not found");
  }
  console.log(Buffer.from(script.content).toString("utf-8"));
  return res.status(200).send(Buffer.from(script.content).toString("utf-8"));
};

const logger = (str: string) => `(() => console.log('${str}'))()`;

export const getBaseScriptHandler = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/javascript");

  const id = req.query.id as string | undefined;
  if (!id) return res.status(400).send(logger("No id provided"));

  const scriptPath = path.resolve(__dirname, "../scripts", "base-loader.js");

  let ignoredPaths: string[] = [];
  try {
    const project = await getProject(id)!;
    ignoredPaths = project?.ignoredPaths || [];
  } catch {}

  try {
    let js = await readFile(scriptPath, {
      encoding: "utf-8",
    });
    js = js.replace(/<PROJECT_ID>/gm, id as string); // Replace placeholder with actual id
    js = js.replace(
      /const ignoredPaths = \[\]\;/gm,
      `const ignoredPaths = ${JSON.stringify(ignoredPaths)};`,
    ); // Replace placeholder with actual id

    return res.send(js);
  } catch (err) {
    console.error(err);
    return res.status(500).send(logger("Failed to load base script"));
  }
};
