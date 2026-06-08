import { prisma } from "../../lib/prisma.js";

const workspaceRepository = {
  findManyByUserId(userId: string) {
    return prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  findById(workspaceId: string) {
    return prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
  },
  findBySlug(slug: string) {
    return prisma.workspace.findUnique({
      where: {
        slug,
      },
    });
  },
  findMembership(userId: string, workspaceId: string) {
    return prisma.workspaceMember.findUnique({
      where: {
        // Composite Unique Key (userId + workspaceId) to find the membership record for a specific user in a specific workspace
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  },
  create(
    data: { name: string; slug: string },
    userId: string,
    roleId: string
  ) {
    return prisma.workspace.create({
      data: {
        ...data,
        members: {
          create: {
            userId,
            roles: {
              create: {
                roleId,
              },
            },
          },
        },
      },
    });
  },
  update(workspaceId: string, data: { name?: string; slug?: string }) {
    return prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data,
    });
  },
  delete(workspaceId: string) {
    return prisma.workspace.delete({
      where: {
        id: workspaceId,
      },
    });
  },
};

export { workspaceRepository };
