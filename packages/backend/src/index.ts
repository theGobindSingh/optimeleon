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
import path from "path";

import { getBaseScriptHandler, getScriptHandler } from "@handlers/script";
import dotenv from "dotenv";

dotenv.config({
  path: [path.resolve(__dirname, "../../../.env"), "./.env", "../.env"],
});

const allowedOrigins = ["http://localhost:3000"];

const app = express();
app.use(express.json());
app.use(
  clerkMiddleware({
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  }),
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.get("/scripts/:projectId.js", getScriptHandler as Application);

app.get("/load-base-script", getBaseScriptHandler as Application);

// Create a new project and enqueue script generation
app.post("/projects", postProjectsHandler as Application);

// List all projects for the current user
app.get("/projects", getProjectsHandler as Application);

// Delete a project by ID
app.delete("/projects/:id", deleteProjectsHandler as Application);

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
