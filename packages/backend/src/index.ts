/* eslint-disable no-console -- need consoles for BE */

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
import { Queue } from "bullmq";
import express from "express";

const app = express();

// POST /db?run=[true|false] — create/start by default, or if run=false, just stop
app.post("/db", dbPostRequestHandler);

// DELETE /db — stop & remove container
app.delete("/db", dbDeleteRequestHandler);

// POST /queue?run=[true|false]
app.post("/queue", redisPostRequestHandler);

// DELETE /queue
app.delete("/queue", redisDeleteRequestHandler);

// (Optional) Example endpoint to demonstrate BullMQ usage
// GET /job-demo
app.get("/job-demo", async (_req, res) => {
  // This creates a BullMQ queue and adds a sample job
  const queue = new Queue("sample", {
    connection: { host: "localhost", port: 6379 },
  });
  await queue.add("demo-job", { when: new Date().toISOString() });
  res.status(200).json({ message: "Demo job added!" });
});

// Start server
const PORT = Number(process.env.PORT ?? 6969);

app.listen(PORT, () => {
  const fn = async () => {
    console.log(await createOrStartRedisContainer());
    console.log(await createOrStartContainer());
    console.log(`BackEnd Server listening on port ${PORT}`);
  };
  void fn();
});
