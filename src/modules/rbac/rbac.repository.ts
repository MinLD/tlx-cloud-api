import { prisma } from "../../lib/prisma.js";

const workspaceMemberIncludeRoles = {
  roles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} as const;

const roleIncludePermissions = {
  rolePermissions: {
    include: {
      permission: true,
    },
  },
} as const;

export const rbacRepository = {
  // Workspace Member
  findWorkspaceMember(userId: string, workspaceId: string) {
    return prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
      include: workspaceMemberIncludeRoles,
    });
  },

  findWorkspaceMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
      include: workspaceMemberIncludeRoles,
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  findPermissionByKey(key: string) {
    return prisma.permission.findUnique({
      where: {
        key,
      },
    });
  },

  attachRoleToWorkspaceMember(workspaceMemberId: string, roleId: string) {
    return prisma.workspaceMemberRole.upsert({
      where: {
        workspaceMemberId_roleId: {
          workspaceMemberId,
          roleId,
        },
      },
      update: {},
      create: {
        workspaceMemberId,
        roleId,
      },
    });
  },

  detachRoleFromWorkspaceMember(workspaceMemberId: string, roleId: string) {
    return prisma.workspaceMemberRole.delete({
      where: {
        workspaceMemberId_roleId: {
          workspaceMemberId,
          roleId,
        },
      },
    });
  },
  // Roles
  findRoleById(roleId: string) {
    return prisma.role.findUnique({
      where: {
        id: roleId,
      },
      include: roleIncludePermissions,
    });
  },

  findRoleByName(workspaceId: string | null, name: string) {
    return prisma.role.findFirst({
      where: {
        workspaceId,
        name,
      },
      include: roleIncludePermissions,
    });
  },

  replaceWorkspaceMemberRoles(workspaceMemberId: string, roleIds: string[]) {
    return prisma.$transaction(async (tx) => {
      await tx.workspaceMemberRole.deleteMany({
        where: {
          workspaceMemberId,
        },
      });

      if (roleIds.length === 0) {
        return [];
      }

      return tx.workspaceMemberRole.createMany({
        data: roleIds.map((roleId) => ({
          workspaceMemberId,
          roleId,
        })),
        skipDuplicates: true,
      });
    });
  },

  findWorkspaceRoles(workspaceId: string) {
    return prisma.role.findMany({
      where: {
        workspaceId,
      },
      include: roleIncludePermissions,
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  createWorkspaceRoleWithPermissions(data: {
    workspaceId: string;
    name: string;
    description?: string | null;
    permissionIds: string[];
  }) {
    return prisma.role.create({
      data: {
        workspaceId: data.workspaceId,
        name: data.name,
        description: data.description,
        isSystem: false,
        rolePermissions: {
          create: data.permissionIds.map((permissionId) => ({
            permissionId,
          })),
        },
      },
      include: roleIncludePermissions,
    });
  },
  updateWorkspaceRoleWithPermissions(
    roleId: string,
    data: {
      name?: string;
      description?: string | null;
      permissionIds?: string[];
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.update({
        where: {
          id: roleId,
        },
        data: {
          name: data.name,
          description: data.description,
        },
      });

      if (data.permissionIds) {
        await tx.rolePermission.deleteMany({
          where: {
            roleId,
          },
        });

        if (data.permissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: data.permissionIds.map((permissionId) => ({
              roleId,
              permissionId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return tx.role.findUnique({
        where: {
          id: role.id,
        },
        include: roleIncludePermissions,
      });
    });
  },

  deleteWorkspaceRole(roleId: string) {
    return prisma.role.delete({
      where: {
        id: roleId,
      },
    });
  },

  // Permission
  findRolePermissions(roleId: string) {
    return prisma.rolePermission.findMany({
      where: {
        roleId,
      },
      include: {
        permission: true,
      },
    });
  },
  findPermissions() {
    return prisma.permission.findMany({
      orderBy: {
        key: "asc",
      },
    });
  },
};
