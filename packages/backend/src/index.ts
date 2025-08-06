/* eslint-disable no-console -- need consoles for BE */

import { clerkMiddleware } from "@clerk/express";
import { BE_PORT } from "@common";
import {
  createOrStartDbContainer,
  dbDeleteRequestHandler,
  dbPostRequestHandler,
} from "@handlers/db";
import {
  deleteProjectsHandler,
  getProjectsHandler,
  postProjectsHandler,
} from "@handlers/project";
import {
  createOrStartRedisContainer,
  redisDeleteRequestHandler,
  redisPostRequestHandler,
} from "@handlers/queue";
import worker from "@workers";
import cors from "cors";
import express, { Application } from "express";
import fs from "fs";
import path from "path";
import { getProject } from "./prisma";

const app = express();
app.use(express.json());
app.use(clerkMiddleware({}));
app.use(
  cors({
    origin: "*",
  }),
);

// Initialize BullMQ queue for script generation

// Create a new project and enqueue script generation
app.post("/projects", postProjectsHandler as Application);

// List all projects for the current user
app.get("/projects", getProjectsHandler as Application);

// Delete a project by ID
app.delete("/projects/:id", deleteProjectsHandler as Application);

// Serve the generated script, with user/origin validation
app.get("/scripts/:id.js", async (req, res) => {
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

const main = async () => {
  console.log(await createOrStartRedisContainer());
  console.log(await createOrStartDbContainer());
  worker();
  console.log(`BackEnd Server listening on port ${BE_PORT}`);
};

app.listen(BE_PORT, () => {
  void main();
});
