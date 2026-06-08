import type {
  WorkspaceInvitation,
  WorkspaceInvitationRole,
  WorkspaceMember,
  WorkspaceMemberRole,
  Role,
} from "../../generated/prisma/client.js";
import type {
  WorkspaceInvitationDto,
  WorkspaceMemberDto,
} from "./member.dto.js";
type RolePayload = Role;

type InvitationWithRoles = WorkspaceInvitation & {
  roles?: Array<
    WorkspaceInvitationRole & {
      role: RolePayload;
    }
  >;
};

type MemberWithRoles = WorkspaceMember & {
  roles?: Array<
    WorkspaceMemberRole & {
      role: RolePayload;
    }
  >;
};

const toRoleDto = (role: RolePayload) => ({
  id: role.id,
  name: role.name,
  description: role.description,
  scope: role.scope,
  isSystem: role.isSystem,
  createdAt: role.createdAt,
  updatedAt: role.updatedAt,
});
export const toWorkspaceInvitationDto = (
  invitation: InvitationWithRoles,
): WorkspaceInvitationDto => ({
  id: invitation.id,
  workspaceId: invitation.workspaceId,
  invitedById: invitation.invitedById,
  invitedUserId: invitation.invitedUserId,
  email: invitation.email,
  status: invitation.status,
  token: invitation.token,
  expiresAt: invitation.expiresAt,
  acceptedAt: invitation.acceptedAt,
  rejectedAt: invitation.rejectedAt,
  revokedAt: invitation.revokedAt,
  createdAt: invitation.createdAt,
  updatedAt: invitation.updatedAt,
  roles: (invitation.roles ?? []).map((item) => ({
    id: item.id,
    roleId: item.roleId,
    role: toRoleDto(item.role),
  })),
});

export const toWorkspaceMemberDto = (
  member: MemberWithRoles,
): WorkspaceMemberDto => ({
  id: member.id,
  userId: member.userId,
  workspaceId: member.workspaceId,
  createdAt: member.createdAt,
  updatedAt: member.updatedAt,
  roles: (member.roles ?? []).map((item) => ({
    id: item.id,
    roleId: item.roleId,
    role: toRoleDto(item.role),
  })),
});
