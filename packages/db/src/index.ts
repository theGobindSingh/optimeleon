import { PrismaClient } from "@p/client";

const prisma = new PrismaClient();

export const createProject = async (name: string) => {
  return prisma.project.create({ data: { name } });
};

export const listProjects = async () => {
  return prisma.project.findMany();
};
