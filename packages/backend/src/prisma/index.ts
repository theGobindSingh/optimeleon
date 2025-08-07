import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const createProject = async (
  name: string,
  targetUrl: string,
  ignoredPaths: string[],
  userId: string,
) => {
  return prisma.project.create({
    data: { name, targetUrl, ignoredPaths, userId },
  });
};

export const listProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getProject = async (id: string) => {
  return prisma.project.findUnique({ where: { id } });
};

export const deleteProject = async (id: string) => {
  return prisma.project.delete({ where: { id } });
};

export const createScript = async (projectId: string, content: string) => {
  return prisma.scripts.create({
    data: { content: Buffer.from(content, "utf-8"), projectId },
  });
};

export const getScript = async (projectId: string) => {
  return prisma.scripts.findFirst({
    where: { projectId },
  });
};
