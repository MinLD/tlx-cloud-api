import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { GetUsersResponse } from "../shared/types/user.type.js";

export const userRepository = {
  findAll(): Promise<GetUsersResponse> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  },
};
