import { prisma } from "../lib/prisma.js";

export const userRepository = {
  findAll() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }
};