import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import { HttpError } from "../../shared/errors/http.error.js";
import { WorkspaceInvitationStatus } from "../../generated/prisma/client.js";
import { mailService } from "../../shared/mail/mail.service.js";
import { memberRepository } from "./member.repository.js";
import {
  toWorkspaceInvitationDto,
  toWorkspaceMemberDto,
} from "./member.mapper.js";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const assertRolesBelongToWorkspace = async (
  workspaceId: string,
  roleIds: string[],
) => {
  const uniqueRoleIds = [...new Set(roleIds)];

  for (const roleId of uniqueRoleIds) {
    const role = await memberRepository.findWorkspaceRoleById(roleId);

    if (!role) {
      throw new HttpError(404, "NOT_FOUND", `Role not found: ${roleId}`);
    }

    if (role.workspaceId !== workspaceId) {
      throw new HttpError(
        400,
        "BAD_REQUEST",
        `Role ${role.name} does not belong to workspace`,
      );
    }
  }

  return uniqueRoleIds;
};

export const memberService = {
 async getMembers(workspaceId: string) {
    const members = await memberRepository.findWorkspaceMembers(workspaceId);
    return {
      members: members.map(toWorkspaceMemberDto),
    };
  },

  async listPendingInvitations(workspaceId: string) {
    const invitations = await memberRepository.listPendingInvitations(workspaceId);
    return {
      invitations: invitations.map(toWorkspaceInvitationDto),
    };
  },

  async inviteMember(params: {
    workspaceId: string;
    invitedById: string;
    email: string;
    roleIds: string[];
    expiresAt?: string;
  }) {
    const email = normalizeEmail(params.email);
    const uniqueRoleIds = await assertRolesBelongToWorkspace(
      params.workspaceId,
      params.roleIds,
    );

    const user = await memberRepository.findUserByEmail(email);
    const invitedUserId = user?.id ?? null;

    if (invitedUserId) {
      const existedMember = await memberRepository.findWorkspaceMember(
        params.workspaceId,
        invitedUserId,
      );

      if (existedMember) {
        throw new HttpError(409, "CONFLICT", "User is already a member");
      }
    }

    const workspace = await memberRepository.findWorkspaceById(params.workspaceId);
    if (!workspace) {
      throw new HttpError(404, "NOT_FOUND", "Workspace not found");
    }

    const invitedBy = await memberRepository.findUserById(params.invitedById);
    if (!invitedBy) {
      throw new HttpError(404, "NOT_FOUND", "Invited by user not found");
    }

    const token = randomUUID();
    const expiresAt = params.expiresAt ? new Date(params.expiresAt) : null;

    const invitation = await memberRepository.createInvitation({
      workspaceId: params.workspaceId,
      invitedById: params.invitedById,
      invitedUserId,
      email,
      token,
      expiresAt,
    });

    await memberRepository.createInvitationRoles(invitation.id, uniqueRoleIds);

    const updatedInvitation = await memberRepository.findInvitationById(invitation.id);

    if (!updatedInvitation) {
      throw new HttpError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Failed to reload invitation",
      );
    }

    const acceptUrl = `${env.APP_URL}/invitations/accept?token=${encodeURIComponent(token)}`;
    const rejectUrl = `${env.APP_URL}/invitations/reject?token=${encodeURIComponent(token)}`;

    await mailService.sendInvitationEmail({
      to: email,
      workspaceName: workspace.name,
      invitedByName: invitedBy.name ?? invitedBy.email,
      acceptUrl,
      rejectUrl,
    });

    return {
      invitation: toWorkspaceInvitationDto(updatedInvitation),
    };
  },

  async acceptInvitation(token: string, userId: string) {
    const invitation = await memberRepository.findInvitationByToken(token);

    if (!invitation) {
      throw new HttpError(404, "NOT_FOUND", "Invitation not found");
    }

    if (invitation.status !== WorkspaceInvitationStatus.PENDING) {
      throw new HttpError(400, "BAD_REQUEST", "Invitation is not pending");
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      await memberRepository.updateInvitationStatus(invitation.id, {
        status: WorkspaceInvitationStatus.EXPIRED,
      });

      throw new HttpError(400, "BAD_REQUEST", "Invitation is expired");
    }

    const user = await memberRepository.findUserById(userId);

    if (!user) {
      throw new HttpError(404, "NOT_FOUND", "User not found");
    }

    if (invitation.invitedUserId && invitation.invitedUserId !== userId) {
      throw new HttpError(403, "FORBIDDEN", "Invitation does not belong to this user");
    }

    const existingMember = await memberRepository.findWorkspaceMember(
      invitation.workspaceId,
      userId,
    );

    if (existingMember) {
      throw new HttpError(409, "CONFLICT", "User is already a member");
    }

    const member = await memberRepository.createWorkspaceMember(
      invitation.workspaceId,
      userId,
    );

    const roleIds = invitation.roles.map((item) => item.roleId);
    await memberRepository.replaceMemberRoles(member.id, roleIds);

    await memberRepository.updateInvitationStatus(invitation.id, {
      status: WorkspaceInvitationStatus.ACCEPTED,
      acceptedAt: new Date(),
      invitedUserId: userId,
    });

    const updatedMember = await memberRepository.findWorkspaceMember(
      invitation.workspaceId,
      userId,
    );

    if (!updatedMember) {
      throw new HttpError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Failed to reload workspace member",
      );
    }

    return {
      member: toWorkspaceMemberDto(updatedMember),
    };
  },

  async rejectInvitation(token: string) {
    const invitation = await memberRepository.findInvitationByToken(token);

    if (!invitation) {
      throw new HttpError(404, "NOT_FOUND", "Invitation not found");
    }

    if (invitation.status !== WorkspaceInvitationStatus.PENDING) {
      throw new HttpError(400, "BAD_REQUEST", "Invitation is not pending");
    }

    const updated = await memberRepository.updateInvitationStatus(invitation.id, {
      status: WorkspaceInvitationStatus.REJECTED,
      rejectedAt: new Date(),
    });

    return {
      invitation: toWorkspaceInvitationDto(updated),
    };
  },

  async revokeInvitation(invitationId: string) {
    const invitation = await memberRepository.findInvitationById(invitationId);

    if (!invitation) {
      throw new HttpError(404, "NOT_FOUND", "Invitation not found");
    }

    if (invitation.status !== WorkspaceInvitationStatus.PENDING) {
      throw new HttpError(400, "BAD_REQUEST", "Invitation is not pending");
    }

    const updated = await memberRepository.updateInvitationStatus(invitation.id, {
      status: WorkspaceInvitationStatus.REVOKED,
      revokedAt: new Date(),
    });

    return {
      invitation: toWorkspaceInvitationDto(updated),
    };
  },

  async updateMemberRoles(workspaceId: string, memberId: string, roleIds: string[]) {
    const uniqueRoleIds = await assertRolesBelongToWorkspace(workspaceId, roleIds);

    const member = await memberRepository.findWorkspaceMemberById(
      workspaceId,
      memberId,
    );

    if (!member) {
      throw new HttpError(404, "NOT_FOUND", "Member not found");
    }

    await memberRepository.replaceMemberRoles(memberId, uniqueRoleIds);

    const updated = await memberRepository.findWorkspaceMemberById(
      workspaceId,
      memberId,
    );

    if (!updated) {
      throw new HttpError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Failed to reload member",
      );
    }

    return {
      member: toWorkspaceMemberDto(updated),
    };
  },

  async removeMember(workspaceId: string, memberId: string) {
    const member = await memberRepository.findWorkspaceMemberById(
      workspaceId,
      memberId,
    );

    if (!member) {
      throw new HttpError(404, "NOT_FOUND", "Member not found");
    }

    await memberRepository.deleteWorkspaceMember(memberId);

    return { success: true as const };
  },

  async leaveWorkspace(workspaceId: string, userId: string) {
    const member = await memberRepository.findWorkspaceMember(workspaceId, userId);

    if (!member) {
      throw new HttpError(404, "NOT_FOUND", "Member not found");
    }

    await memberRepository.deleteWorkspaceMember(member.id);

    return { success: true as const };
  },
};


