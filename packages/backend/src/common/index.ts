import Docker from "dockerode";

let DOCKER: Docker | null = null;

export const getDocker = () => {
  if (DOCKER) return DOCKER;
  DOCKER = new Docker({ socketPath: "/var/run/docker.sock" });
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
