import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export const userRepository = {
  findAll(params: {
    skip: number;
    take: number;
    search?: string;
    sortBy: "createdAt" | "name" | "email";
    sortOrder: "asc" | "desc";
  }) {
    const where: Prisma.UserWhereInput = params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { email: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {};

    return prisma.$transaction([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
        orderBy: {
          [params.sortBy]: params.sortOrder,
        },
        skip: params.skip,
        take: params.take,
      }),
      prisma.user.count({ where }),
    ]);
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findIdentityById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: {
            roleName: true,
            role: {
              select: {
                permissions: {
                  select: {
                    permissionName: true,
                  },
                },
              },
            },
          },
        },
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
