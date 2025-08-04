import { PrismaClient } from "@p/client";

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

export const updateProjectScriptPath = async (
  id: string,
  scriptPath: string,
) => {
  return prisma.project.update({ where: { id }, data: { scriptPath } });
};
