/* eslint-disable no-console -- need consoles for BE */

import { CONTAINERS, getDocker } from "@common";
import { RequestHandler } from "express";

const docker = getDocker();
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "password";

/**
 * Ensure the Postgres image is available locally; pull it if missing.
 */
const ensurePostgresImage = async () => {
  const images = await docker.listImages({
    filters: { reference: [CONTAINERS.DB.image] },
  });
  if (images.length === 0) {
    console.log(`Pulling ${CONTAINERS.DB.image}…`);
    await new Promise<void>((resolve, reject) => {
      void docker.pull(CONTAINERS.DB.image, {}, (err: Error, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream!, (err) =>
          err ? reject(err) : resolve(),
        );
      });
    });
    console.log(`Image ${CONTAINERS.DB.image} pulled successfully`);
  }
};

/**
 * Wait for Postgres to be ready to accept connections.
 */
const waitForPostgres = async (maxRetries = 30): Promise<void> => {
  const { createConnection } = await import("node:net");

  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const socket = createConnection(CONTAINERS.DB.port, "localhost");

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

      console.log("✅ Postgres is ready!");
      return;
    } catch {
      console.log(
        `⏳ Waiting for Postgres... (attempt ${i + 1}/${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error("Postgres failed to become ready after maximum retries");
};

/**
 * Create or start the Postgres container.
 */
export const createOrStartDbContainer = async (): Promise<string> => {
  await ensurePostgresImage();

  const container = docker.getContainer(CONTAINERS.DB.name);
  const info = await container.inspect().catch(() => null);

  let message: string;

  if (info) {
    if (info.State.Running) {
      message = "Postgres container is already running";
    } else {
      await container.start();
      message = "Existing Postgres container started";
    }
  } else {
    await docker
      .createContainer({
        Image: CONTAINERS.DB.image,
        name: CONTAINERS.DB.name,
        Env: [`POSTGRES_PASSWORD=${POSTGRES_PASSWORD}`],
        HostConfig: {
          PortBindings: {
            [`${CONTAINERS.DB.port}/tcp`]: [
              { HostPort: String(CONTAINERS.DB.port) },
            ],
          },
        },
      })
      .then((ctr) => ctr.start());
    message = "New Postgres container created & started";
  }

  // Wait for Postgres to be ready before returning
  await waitForPostgres();

  return message;
};

/**
 * Stop the Postgres container (but do not remove it).
 */
const stopContainer = async (): Promise<string> => {
  const container = docker.getContainer(CONTAINERS.DB.name);
  await container.stop().catch(() => null);
  return "Postgres container stopped";
};

/**
 * Stop and remove the Postgres container.
 */
const stopAndRemoveContainer = async (): Promise<string> => {
  const container = docker.getContainer(CONTAINERS.DB.name);
  await container.stop().catch(() => null);
  await container.remove({ force: true }).catch(() => null);
  return "Postgres container stopped & removed";
};

export const dbPostRequestHandler: RequestHandler = async (req, res) => {
  try {
    const runParam = String((req.query.run as string) ?? "").toLowerCase();
    const run = runParam === "false" ? false : true;

    let message: string;
    if (!run) {
      message = await stopContainer();
    } else {
      message = await createOrStartDbContainer();
    }

    res.status(200).json({ message });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message ?? "Failed to process container action" });
  }
};

export const dbDeleteRequestHandler: RequestHandler = async (_req, res) => {
  try {
    const message = await stopAndRemoveContainer();
    res.status(200).json({ message });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message ?? "Failed to stop/remove container" });
  }
};
