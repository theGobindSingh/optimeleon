import Docker from "dockerode";
import { existsSync } from "fs";
import os from "os";
import path from "path";

let DOCKER: Docker | null = null;

const getSocketPath = (): string => {
  const dockerHost = process.env.DOCKER_HOST;

  // 1. Use DOCKER_HOST if set
  if (dockerHost?.startsWith("unix://")) {
    const resolved = dockerHost.replace("unix://", "");
    if (existsSync(resolved)) return resolved;
  }

  const platform = os.platform();

  // 2. macOS: try all known socket locations
  if (platform === "darwin") {
    const candidates = [
      // Colima
      path.join(os.homedir(), ".colima/default/docker.sock"),
      path.join(os.homedir(), ".colima/docker.sock"),

      // Docker Desktop
      path.join(os.homedir(), ".docker/run/docker.sock"),
      path.join(
        os.homedir(),
        "Library/Containers/com.docker.docker/Data/docker.sock",
      ),
    ];

    for (const sockPath of candidates) {
      if (existsSync(sockPath)) return sockPath;
    }

    throw new Error(
      "❌ Docker socket not found on macOS (Colima or Docker Desktop)",
    );
  }

  // 3. Linux: default docker path
  if (platform === "linux") {
    const linuxSock = "/var/run/docker.sock";
    if (existsSync(linuxSock)) return linuxSock;
    throw new Error("❌ Docker socket not found on Linux");
  }

  // 4. Unsupported OS
  throw new Error(`❌ Unsupported OS for Docker socket detection: ${platform}`);
};

export const getDocker = () => {
  if (DOCKER) return DOCKER;
  DOCKER = new Docker({ socketPath: getSocketPath() });
  return DOCKER;
};

enum DockerParts {
  DB = "DB",
  REDIS = "REDIS",
}

const PORTS: Record<DockerParts, number> = {
  DB: 5432,
  REDIS: 6379,
};

type ContainerType = Record<
  DockerParts,
  {
    name: string;
    image: string;
    port: number;
  }
>;

export const CONTAINERS: ContainerType = {
  DB: {
    name: "my-postgres",
    image: "postgres:latest",
    port: PORTS.DB,
  },
  REDIS: {
    name: "my-redis",
    image: "redis:latest",
    port: PORTS.REDIS,
  },
};

export const BE_PORT = Number(process.env.PORT ?? 6969);
