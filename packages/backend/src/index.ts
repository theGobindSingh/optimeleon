/* eslint-disable no-console -- need consoles for BE */

import { CONTAINERS } from "@common";
import {
  createOrStartDbContainer,
  dbDeleteRequestHandler,
  dbPostRequestHandler,
} from "@handlers/db";
import {
  createOrStartRedisContainer,
  redisDeleteRequestHandler,
  redisPostRequestHandler,
} from "@handlers/queue";
import { verifyClerk } from "@middlewares/clerk-auth";
import { createProject, getProject, listProjects } from "@optimeleon/db";
import worker from "@workers";
import { Queue } from "bullmq";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 6969);

// Initialize BullMQ queue for script generation
const projectQueue = new Queue("script-queue", {
  connection: { host: "localhost", port: CONTAINERS.REDIS.port },
});

// Create a new project and enqueue script generation
app.post("/projects", verifyClerk, async (req, res) => {
  const { name, targetUrl, ignoredPaths } = req.body;
  const userId = (req as any)?.clerk?.userId ?? "demo-user";

  if (!name || !targetUrl) {
    return res.status(400).json({ error: "Name and targetUrl are required" });
  }

  // Persist project
  const project = await createProject(
    name as string,
    targetUrl as string,
    (ignoredPaths as string[]) ?? [],
    userId as string,
  );

  // Enqueue background job
  await projectQueue.add("generateScript", {
    projectId: project.id,
    targetUrl: project.targetUrl,
    ignoredPaths: project.ignoredPaths,
    userId: project.userId,
  });

  // Return script tag for embedding
  return res.status(201).json({
    projectId: project.id,
    scriptTag: `<script src="http://localhost:${PORT}/scripts/${project.id}.js" data-user="${userId}"></script>`,
  });
});

// List all projects for the current user
app.get("/projects", verifyClerk, async (_, res) => {
  // const projects = await listProjects({ userId: req.clerk.userId });
  const projects = await listProjects("demo-user");
  res.json(projects);
});

// Serve the generated script, with user/origin validation
app.get("/scripts/:id.js", verifyClerk, async (req, res) => {
  const project = await getProject(req?.params?.id ?? "");
  if (!project || project.userId !== (req as any)?.clerk?.userId) {
    return res.status(403).end();
  }

  const origin = req?.headers?.origin;
  if (origin !== project.targetUrl) {
    return res.status(403).end();
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "scripts",
    `${project.id}.js`,
  );
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Script not found" });
  }

  return res
    .type("application/javascript")
    .send(fs.readFileSync(filePath, "utf-8"));
});

// POST /db?run=[true|false]
app.post("/db", dbPostRequestHandler);

// DELETE /db
app.delete("/db", dbDeleteRequestHandler);

// POST /queue?run=[true|false]
app.post("/queue", redisPostRequestHandler);

// DELETE /queue
app.delete("/queue", redisDeleteRequestHandler);

app.get("/job-demo", async (_req, res) => {
  await projectQueue.add("demo-job", { when: new Date().toISOString() });
  res.status(200).json({ message: "Demo job added!" });
});

const main = async () => {
  console.log(await createOrStartRedisContainer());
  console.log(await createOrStartDbContainer());
  worker();
  console.log(`BackEnd Server listening on port ${PORT}`);
};

app.listen(PORT, () => {
  void main();
});
