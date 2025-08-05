/* eslint-disable no-console -- need consoles for BE */

import { CONTAINERS, getDocker } from "@common";
import { RequestHandler } from "express";

const docker = getDocker();

// Pull latest Redis image if missing
const ensureRedisImage = async () => {
  const images = await docker.listImages({
    filters: { reference: [CONTAINERS.REDIS.image] },
  });
  if (images.length === 0) {
    console.log(`Pulling ${CONTAINERS.REDIS.image}...`);
    await new Promise((resolve, reject) => {
      void docker.pull(CONTAINERS.REDIS.image, {}, (err: Error, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream!, (err) =>
          err ? reject(err) : resolve(void 0),
        );
      });
    });
    console.log(`Image ${CONTAINERS.REDIS.image} pulled successfully`);
  }
};

// Wait for Redis to be ready
const waitForRedis = async (maxRetries = 30): Promise<void> => {
  const { createConnection } = await import("node:net");

  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const socket = createConnection(CONTAINERS.REDIS.port, "localhost");

        const timeout = setTimeout(() => {
          socket.destroy();
          reject(new Error("Connection timeout"));
        }, 1000);

        socket.on("connect", () => {
          clearTimeout(timeout);
          socket.destroy();
          resolve();
        });

        socket.on("error", (err) => {
          clearTimeout(timeout);
          socket.destroy();
          reject(err);
        });
      });

      console.log("✅ Redis is ready!");
      return;
    } catch {
      console.log(`⏳ Waiting for Redis... (attempt ${i + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error("Redis failed to become ready after maximum retries");
};

export const createOrStartRedisContainer = async (): Promise<string> => {
  await ensureRedisImage();
  const container = docker.getContainer(CONTAINERS.REDIS.name);
  const info = await container.inspect().catch(() => null);

  let message: string;

  if (info) {
    if (info.State.Running) {
      message = "Redis container is already running";
    } else {
      await container.start();
      message = "Existing Redis container started";
    }
  } else {
    await docker
      .createContainer({
        Image: CONTAINERS.REDIS.image,
        name: CONTAINERS.REDIS.name,
        HostConfig: {
          PortBindings: {
            [`${CONTAINERS.REDIS.port}/tcp`]: [
              { HostPort: String(CONTAINERS.REDIS.port) },
            ],
          },
        },
      })
      .then((ctr) => ctr.start());
    message = "New Redis container created & started";
  }

  // Wait for Redis to be ready before returning
  await waitForRedis();

  return message;
};

const stopRedisContainer = async (): Promise<string> => {
  const container = docker.getContainer(CONTAINERS.REDIS.name);
  await container.stop().catch(() => null);
  return "Redis container stopped";
};

const stopAndRemoveRedisContainer = async (): Promise<string> => {
  const container = docker.getContainer(CONTAINERS.REDIS.name);
  await container.stop().catch(() => null);
  await container.remove({ force: true }).catch(() => null);
  return "Redis container stopped & removed";
};

export const redisPostRequestHandler: RequestHandler = async (req, res) => {
  try {
    const runParam = String((req.query.run as string) ?? "").toLowerCase();
    const run = runParam === "false" ? false : true;
    let message: string;
    if (!run) {
      message = await stopRedisContainer();
    } else {
      message = await createOrStartRedisContainer();
    }
    res.status(200).json({ message });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message ?? "Failed to process container action" });
  }
};

export const redisDeleteRequestHandler: RequestHandler = async (_req, res) => {
  try {
    const message = await stopAndRemoveRedisContainer();
    res.status(200).json({ message });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message ?? "Failed to stop/remove container" });
  }
};
