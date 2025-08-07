/* eslint-disable no-console -- needed */

import { CONTAINERS } from "@common";
import { Job, Worker } from "bullmq";
import { readFile } from "fs/promises";
import path from "path";

import { JobData, JobResult } from "@common/types";
import { createScript } from "src/prisma";

const jobHandler = async (
  job: Job<JobData, JobResult, string>,
): Promise<JobResult> => {
  const { projectId, targetUrl, projectName } = job.data;
  let js = `// Script for project ${projectId} at ${targetUrl}\n`;

  const scriptPath = path.resolve(
    __dirname,
    "../scripts",
    "check-variation.js",
  );

  try {
    const tempJs = await readFile(scriptPath, {
      encoding: "utf-8",
    });
    js += tempJs.replace(/<CHANGEABLE_CONTENT>/gm, projectName as string);
  } catch (err) {
    console.error(err);
    return {
      isSuccess: false,
    };
  }

  try {
    await createScript(projectId, js);
    return {
      isSuccess: true,
    };
  } catch {
    return {
      isSuccess: false,
    };
  }
};

const main = () => {
  console.log("Starting worker...");
  const worker = new Worker("script-queue", jobHandler, {
    connection: { host: "localhost", port: CONTAINERS.REDIS.port },
  });

  worker.on("ready", () => {
    console.log("Worker is ready");
  });

  worker.on("active", (job) => {
    console.log(`Worker is processing job ${job.id}`);
  });

  worker.on("stalled", (job) => {
    console.warn(`Job ${job} stalled`);
  });

  worker.on("completed", (job) => {
    console.log(
      `✅ Job ${job.id} completed for project ${job.data.projectName}`,
    );
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err);
  });

  return worker;
};

export default main;
