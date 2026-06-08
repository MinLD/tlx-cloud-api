export type WorkspaceInvitationDto = {
  id: string;
  workspaceId: string;
  invitedById: string;
  invitedUserId: string | null;
  email: string;
  status: string;
  token: string;
  expiresAt: Date | null;
  acceptedAt: Date | null;
  rejectedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roles: Array<{
    id: string;
    roleId: string;
    role: {
      id: string;
      name: string;
      description: string | null;
      scope: string;
      isSystem: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
};
export type WorkspaceMemberDto = {
  id: string;
  userId: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  roles: Array<{
    id: string;
    roleId: string;
    role: {
      id: string;
      name: string;
      description: string | null;
      scope: string;
      isSystem: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
};
export type InviteMemberResponseDto = {
  invitation: WorkspaceInvitationDto;
};

export type AcceptInvitationResponseDto = {
  member: WorkspaceMemberDto;
};

export type RejectInvitationResponseDto = {
  invitation: WorkspaceInvitationDto;
};
export type RevokeInvitationResponseDto = {
  invitation: WorkspaceInvitationDto;
};
export type GetMembersResponseDto = {
  members: WorkspaceMemberDto[];
};

export type GetPendingInvitationsResponseDto = {
  invitations: WorkspaceInvitationDto[];
};
export type UpdateMemberRolesResponseDto = {
  member: WorkspaceMemberDto;
};
export type SimpleActionResponseDto = {
  success: true;
};
