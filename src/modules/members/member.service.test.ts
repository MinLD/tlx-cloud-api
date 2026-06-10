/* @ts-nocheck */
/// <reference types="bun" />
import { afterEach, describe, expect, mock, test } from "bun:test";
import { WorkspaceInvitationStatus } from "../../generated/prisma/client.js";
import { mailService } from "../../shared/mail/mail.service.js";
import { memberRepository } from "./member.repository.js";
import { memberService } from "./member.service.js";

const repo = memberRepository as unknown as Record<string, any>;

const originalRepository = {
  findWorkspaceById: repo.findWorkspaceById,
  findWorkspaceMembers: repo.findWorkspaceMembers,
  findWorkspaceMember: repo.findWorkspaceMember,
  findWorkspaceMemberById: repo.findWorkspaceMemberById,
  createWorkspaceMember: repo.createWorkspaceMember,
  deleteWorkspaceMember: repo.deleteWorkspaceMember,
  replaceMemberRoles: repo.replaceMemberRoles,
  findInvitationById: repo.findInvitationById,
  findInvitationByToken: repo.findInvitationByToken,
  listPendingInvitations: repo.listPendingInvitations,
  createInvitation: repo.createInvitation,
  createInvitationRoles: repo.createInvitationRoles,
  updateInvitationStatus: repo.updateInvitationStatus,
  findWorkspaceRoleById: repo.findWorkspaceRoleById,
  findUserByEmail: repo.findUserByEmail,
  findUserById: repo.findUserById,
};

const originalMailService = {
  sendInvitationEmail: mailService.sendInvitationEmail,
};

afterEach(() => {
  Object.assign(repo, originalRepository);
  Object.assign(mailService, originalMailService);
  mock.restore();
});

describe("members service", () => {
  test("inviteMember creates invitation and invitation roles", async () => {
    repo.findWorkspaceById = mock(async () => ({
      id: "ws_1",
      name: "Workspace 1",
      description: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      ownerId: "user_1",
    }));
    repo.findWorkspaceRoleById = mock(async (roleId: string) => ({
      id: roleId,
      workspaceId: "ws_1",
      name: roleId === "role_admin" ? "Admin" : "Member",
      description: null,
      isSystem: false,
      scope: "WORKSPACE",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    }));

    repo.findUserByEmail = mock(async () => null);
    repo.findUserById = mock(async () => ({
      id: "user_1",
      name: "Inviter",
      email: "inviter@example.com",
      password: "hashed",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    }));
    mailService.sendInvitationEmail = mock(async () => ({ skipped: true as const }));
    repo.createInvitation = mock(async () => ({
      id: "inv_1",
      workspaceId: "ws_1",
      invitedById: "user_1",
      invitedUserId: null,
      email: "test@example.com",
      status: WorkspaceInvitationStatus.PENDING,
      token: "token_1",
      expiresAt: null,
      acceptedAt: null,
      rejectedAt: null,
      revokedAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      roles: [],
    }));
    repo.createInvitationRoles = mock(async () => ({ count: 2 }));
    repo.findInvitationById = mock(async () => ({
      id: "inv_1",
      workspaceId: "ws_1",
      invitedById: "user_1",
      invitedUserId: null,
      email: "test@example.com",
      status: WorkspaceInvitationStatus.PENDING,
      token: "token_1",
      expiresAt: null,
      acceptedAt: null,
      rejectedAt: null,
      revokedAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      roles: [
        {
          id: "ivr_1",
          roleId: "role_admin",
          role: {
            id: "role_admin",
            name: "Admin",
            description: null,
            isSystem: false,
            scope: "WORKSPACE",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
            updatedAt: new Date("2026-01-01T00:00:00.000Z"),
          },
        },
        {
          id: "ivr_2",
          roleId: "role_member",
          role: {
            id: "role_member",
            name: "Member",
            description: null,
            isSystem: false,
            scope: "WORKSPACE",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
            updatedAt: new Date("2026-01-01T00:00:00.000Z"),
          },
        },
      ],
    }));

    const result = await memberService.inviteMember({
      workspaceId: "ws_1",
      invitedById: "user_1",
      email: "Test@Example.com",
      roleIds: ["role_admin", "role_member"],
    });

    expect(result.invitation.email).toBe("test@example.com");
    expect(result.invitation.roles).toHaveLength(2);
    expect(repo.createInvitationRoles).toHaveBeenCalledTimes(1);
    expect(mailService.sendInvitationEmail).toHaveBeenCalledTimes(1);
  });

  test("acceptInvitation creates member and copies invitation roles", async () => {
    repo.findInvitationByToken = mock(async () => ({
      id: "inv_1",
      workspaceId: "ws_1",
      invitedById: "user_2",
      invitedUserId: null,
      email: "test@example.com",
      status: WorkspaceInvitationStatus.PENDING,
      token: "token_1",
      expiresAt: null,
      acceptedAt: null,
      rejectedAt: null,
      revokedAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      roles: [
        {
          id: "ivr_1",
          roleId: "role_admin",
          role: {
            id: "role_admin",
            name: "Admin",
            description: null,
            isSystem: false,
            scope: "WORKSPACE",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
            updatedAt: new Date("2026-01-01T00:00:00.000Z"),
          },
        },
      ],
    }));

    repo.findUserById = mock(async (userId: string) => ({
      id: userId,
      name: "Test User",
      email: "test@example.com",
      password: "hashed",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    }));

    repo.findWorkspaceMember = mock(async () => null);
    repo.createWorkspaceMember = mock(async () => ({
      id: "member_1",
      userId: "user_1",
      workspaceId: "ws_1",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      roles: [],
    }));
    repo.replaceMemberRoles = mock(async () => []);
    repo.updateInvitationStatus = mock(async () => ({
      id: "inv_1",
      workspaceId: "ws_1",
      invitedById: "user_2",
      invitedUserId: "user_1",
      email: "test@example.com",
      status: WorkspaceInvitationStatus.ACCEPTED,
      token: "token_1",
      expiresAt: null,
      acceptedAt: new Date("2026-01-02T00:00:00.000Z"),
      rejectedAt: null,
      revokedAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
      roles: [],
    }));

    let getMemberCallCount = 0;
    repo.findWorkspaceMember = mock(async () => {
      getMemberCallCount += 1;

      if (getMemberCallCount === 1) {
        return null;
      }

      return {
        id: "member_1",
        userId: "user_1",
        workspaceId: "ws_1",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        roles: [
          {
            id: "wmr_1",
            roleId: "role_admin",
            role: {
              id: "role_admin",
              name: "Admin",
              description: null,
              isSystem: false,
              scope: "WORKSPACE",
              createdAt: new Date("2026-01-01T00:00:00.000Z"),
              updatedAt: new Date("2026-01-01T00:00:00.000Z"),
            },
          },
        ],
      };
    });

    repo.findWorkspaceMemberById = mock(async () => ({
      id: "member_1",
      userId: "user_1",
      workspaceId: "ws_1",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      roles: [
        {
          id: "wmr_1",
          roleId: "role_admin",
          role: {
            id: "role_admin",
            name: "Role",
            description: null,
            isSystem: false,
            scope: "WORKSPACE",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
            updatedAt: new Date("2026-01-01T00:00:00.000Z"),
          },
        },
      ],
    }));

    const result = await memberService.acceptInvitation("token_1", "user_1");

    expect(result.member.id).toBe("member_1");
    expect(result.member.roles).toHaveLength(1);
    expect(repo.createWorkspaceMember).toHaveBeenCalledTimes(1);
    expect(repo.replaceMemberRoles).toHaveBeenCalledWith("member_1", [
      "role_admin",
    ]);
    expect(repo.updateInvitationStatus).toHaveBeenCalledTimes(1);
  });

  test("updateMemberRoles validates workspace role ids", async () => {
    repo.findWorkspaceRoleById = mock(async (roleId: string) => ({
      id: roleId,
      workspaceId: "ws_1",
      name: "Role",
      description: null,
      isSystem: false,
      scope: "WORKSPACE",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    }));

    repo.findWorkspaceMemberById = mock(async () => ({
      id: "member_1",
      userId: "user_1",
      workspaceId: "ws_1",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      roles: [],
    }));

    repo.replaceMemberRoles = mock(async () => []);
    let updateMemberCallCount = 0;
    repo.findWorkspaceMemberById = mock(async () => {
      updateMemberCallCount += 1;

      if (updateMemberCallCount === 1) {
        return {
          id: "member_1",
          userId: "user_1",
          workspaceId: "ws_1",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
          roles: [],
        };
      }

      return {
        id: "member_1",
        userId: "user_1",
        workspaceId: "ws_1",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        roles: [
          {
            id: "wmr_1",
            roleId: "role_admin",
            role: {
              id: "role_admin",
              name: "Role",
              description: null,
              isSystem: false,
              scope: "WORKSPACE",
              createdAt: new Date("2026-01-01T00:00:00.000Z"),
              updatedAt: new Date("2026-01-01T00:00:00.000Z"),
            },
          },
        ],
      };
    });

    const result = await memberService.updateMemberRoles("ws_1", "member_1", [
      "role_admin",
    ]);

    expect(result.member.roles).toHaveLength(1);
    expect(repo.replaceMemberRoles).toHaveBeenCalledWith("member_1", [
      "role_admin",
    ]);
  });
});