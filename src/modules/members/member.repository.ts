import { prisma } from "../../lib/prisma.js";
import { WorkspaceInvitationStatus } from "../../generated/prisma/client.js";

export const memberRepository = {
  findWorkspaceById(workspaceId: string) {
    return prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
  },
  findWorkspaceMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
  findWorkspaceMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUnique({
      where: {
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
  findWorkspaceMemberById(workspaceId: string, memberId: string) {
    return prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId,
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  },
  createWorkspaceMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
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

  deleteWorkspaceMember(memberId: string) {
    return prisma.workspaceMember.delete({
      where: {
        id: memberId,
      },
    });
  },
  replaceMemberRoles(memberId: string, roleIds: string[]) {
    //rollback when error
    return prisma.$transaction(async (ts) => {
      await ts.workspaceMemberRole.deleteMany({
        where: {
          workspaceMemberId: memberId,
        },
      });
      if (roleIds.length === 0) return [];

      return ts.workspaceMemberRole.createMany({
        data: roleIds.map((roleId) => ({
          workspaceMemberId: memberId,
          roleId,
        })),
        // skip uplicate data
        skipDuplicates: true,
      });
    });
  },
  findInvitationById(invitationId: string) {
    return prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  },
  findInvitationByToken(token: string) {
    return prisma.workspaceInvitation.findUnique({
      where: { token },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  },
  listPendingInvitations(workspaceId: string) {
    return prisma.workspaceInvitation.findMany({
      where: {
        workspaceId,
        status: WorkspaceInvitationStatus.PENDING,
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  createInvitation(data: {
    workspaceId: string;
    invitedById: string;
    invitedUserId: string | null;
    email: string;
    token: string;
    expiresAt: Date | null;
  }) {
    return prisma.workspaceInvitation.create({
      data: {
        ...data,
        status: WorkspaceInvitationStatus.PENDING,
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  },
  createInvitationRoles(invitationId: string, roleIds: string[]) {
    return prisma.workspaceInvitationRole.createMany({
      data: roleIds.map((roleId) => ({
        invitationId,
        roleId,
      })),
      skipDuplicates: true,
    });
  },
  updateInvitationStatus(
    invitationId: string,
    data: {
      status: WorkspaceInvitationStatus;
      acceptedAt?: Date | null;
      rejectedAt?: Date | null;
      revokedAt?: Date | null;
      invitedUserId?: string | null;
    },
  ) {
    return prisma.workspaceInvitation.update({
      where: { id: invitationId },
      data,
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  },
  findWorkspaceRoleById(roleId: string) {
    return prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });
  },
  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },
};
