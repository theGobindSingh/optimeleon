/* eslint-disable no-console -- need consoles for BE */

import { Queue } from "bullmq";
import express from "express";
import fs from "fs";
import path from "path";

import {
  createOrStartContainer,
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

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 6969);

// Initialize BullMQ queue for script generation
const projectQueue = new Queue("script-queue", {
  connection: { host: "localhost", port: 6379 },
});

//
// Projects API
//

// Create a new project and enqueue script generation
app.post("/projects", verifyClerk, async (req, res) => {
  const { name, targetUrl, ignoredPaths } = req.body;
  const userId = req.clerk.userId;

  if (!name || !targetUrl) {
    return res.status(400).json({ error: "Name and targetUrl are required" });
  }

  // Persist project
  const project = await createProject(
    name,
    targetUrl,
    ignoredPaths || [],
    userId,
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
app.get("/projects", verifyClerk, async (req, res) => {
  const projects = await listProjects({ userId: req.clerk.userId });
  res.json(projects);
});

// Serve the generated script, with user/origin validation
app.get("/scripts/:id.js", verifyClerk, async (req, res) => {
  const project = await getProject(req.params.id);
  if (!project || project.userId !== req?.clerk?.userId) {
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

  res.type("application/javascript").send(fs.readFileSync(filePath, "utf-8"));
});

//
// Existing DB container management routes
//

// POST /db?run=[true|false]
app.post("/db", dbPostRequestHandler);

// DELETE /db
app.delete("/db", dbDeleteRequestHandler);

//
// Existing Redis/Queue container management routes
//

// POST /queue?run=[true|false]
app.post("/queue", redisPostRequestHandler);

// DELETE /queue
app.delete("/queue", redisDeleteRequestHandler);

//
// Optional demo endpoint for testing enqueuing
//

app.get("/job-demo", async (_req, res) => {
  await projectQueue.add("demo-job", { when: new Date().toISOString() });
  res.status(200).json({ message: "Demo job added!" });
});

//
// Start server
//

app.listen(PORT, () => {
  void (async () => {
    console.log(await createOrStartRedisContainer());
    console.log(await createOrStartContainer());
    console.log(`BackEnd Server listening on port ${PORT}`);
  })();
});
