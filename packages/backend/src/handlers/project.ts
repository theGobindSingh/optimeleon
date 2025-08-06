import type { ExpressRequestWithAuth } from "@clerk/express";
import { CONTAINERS } from "@common";
import { Queue } from "bullmq";
import { Response } from "express";
import { Project } from "generated/prisma";
import { createProject, deleteProject, listProjects } from "../prisma";

type AppHandler<T> = (
  req: ExpressRequestWithAuth,
  res: Response<T>,
) => Promise<unknown>;

const projectQueue = new Queue("script-queue", {
  connection: { host: "localhost", port: CONTAINERS.REDIS.port },
});

projectQueue.on("waiting", (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed`);
});

export const postProjectsHandler: AppHandler<any> = async (req, res) => {
  const { name, targetUrl, ignoredPaths = [] } = req.body;
  const userId = req?.auth?.()?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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

  const formattedProject: Omit<Project, "userId" | "scriptPath"> = {
    createdAt: project.createdAt,
    id: project.id,
    name: project.name,
    targetUrl: project.targetUrl,
    ignoredPaths: project.ignoredPaths,
  };

  return res.status(200).json(formattedProject);
};

export const getProjectsHandler: AppHandler<{
  projects: Omit<Project, "userId" | "scriptPath">[];
  isError: boolean;
  message: string;
}> = async (req, res) => {
  const userId = req?.auth?.()?.userId;
  if (!userId) {
    return res
      .status(401)
      .json({ isError: true, message: "Unauthorized", projects: [] });
  }
  const projects = await listProjects(userId);
  return res.status(200).json({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- remove userId from response
    projects: projects.map(({ userId, scriptPath, ...rest }) => rest),
    isError: false,
    message: "Projects retrieved successfully",
  });
};

export const deleteProjectsHandler: AppHandler<{
  isError: boolean;
  message: string;
}> = async (req, res) => {
  const projectId = req.params.id;
  if (!projectId) {
    return res
      .status(400)
      .json({ isError: true, message: "Project ID is required" });
  }

  try {
    await deleteProject(projectId);
    return res
      .status(200)
      .json({ message: "Project deleted successfully", isError: false });
  } catch {
    return res
      .status(500)
      .json({ isError: true, message: "Failed to delete project" });
  }
};
