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

export const getProject = async (id: string) => {
  return prisma.project.findUnique({ where: { id } });
};

export const listProjects = async () => {
  return prisma.project.findMany();
};
