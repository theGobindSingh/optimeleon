import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getScriptHandler = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  // Optional: log, auth, transform, etc.
  console.log(`Serving script for projectId: ${projectId} at ${__dirname}`);

  // res.setHeader("Content-Type", "application/javascript");
  res.status(200).json({
    message: `working script for projectId: ${projectId}`,
  });

  // const filePath = path.join(__dirname, "scripts", `${projectId}.js`);

  // if (fs.existsSync(filePath)) {
  //   res.setHeader("Content-Type", "application/javascript");
  //   res.sendFile(filePath);
  // } else {
  //   res.status(404).send(`// Script not found for id: ${id}`);
  // }
};
