import { HttpError } from "../../shared/errors/http.error.js";
import {
  PERMISSION_SCOPE,
  type PermissionKey,
  type PermissionScope,
} from "../../shared/permissions/permission.keys.js";
import type { WorkspaceMemberDto } from "./rbac.dto.js";
import { toPermissionDto, toRoleDto, toWorkspaceMemberDto } from "./rbac.mapper.js";
import { rbacRepository } from "./rbac.repository.js";

type HasPermissionParams = {
  userId: string;
  workspaceId: string;
  permissionKey: PermissionKey | string;
};

type HasRoleParams = {
  userId: string;
  workspaceId: string;
  roleNames: string[];
};

type GetPermissionsParams = {
  scope?: PermissionScope;
};

type UpdateWorkspaceMemberRolesParams = {
  workspaceId: string;
  userId: string;
  roleIds: string[];
};

export const rbacService = {
  async getWorkspaceMember(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto | null> {
    const member = await rbacRepository.findWorkspaceMember(
      userId,
      workspaceId,
    );

    if (!member) {
      return null;
    }

    return toWorkspaceMemberDto(member);
  },

  async getWorkspaceMembers(
    workspaceId: string,
  ): Promise<WorkspaceMemberDto[]> {
    const members = await rbacRepository.findWorkspaceMembers(workspaceId);

    return members.map(toWorkspaceMemberDto);
  },

  async hasPermission({
    userId,
    workspaceId,
    permissionKey,
  }: HasPermissionParams): Promise<boolean> {
    const member = await rbacRepository.findWorkspaceMember(
      userId,
      workspaceId,
    );

    if (!member?.roles?.length) {
      return false;
    }

    return member.roles.some((memberRole) =>
      memberRole.role.rolePermissions.some(
        (rolePermission) => rolePermission.permission.key === permissionKey,
      ),
    );
  },

  async hasRole({
    userId,
    workspaceId,
    roleNames,
  }: HasRoleParams): Promise<boolean> {
    const member = await rbacRepository.findWorkspaceMember(
      userId,
      workspaceId,
    );

    if (!member?.roles?.length) {
      return false;
    }

    return member.roles.some((memberRole) =>
      roleNames.includes(memberRole.role.name),
    );
  },

  async updateWorkspaceMemberRoles({
    workspaceId,
    userId,
    roleIds,
  }: UpdateWorkspaceMemberRolesParams): Promise<WorkspaceMemberDto> {
    const member = await rbacRepository.findWorkspaceMember(
      userId,
      workspaceId,
    );

    if (!member) {
      throw new HttpError(404, "NOT_FOUND", "Workspace member not found");
    }

    const uniqueRoleIds = [...new Set(roleIds)];

    for (const roleId of uniqueRoleIds) {
      const role = await rbacRepository.findRoleById(roleId);

      if (!role) {
        throw new HttpError(404, "NOT_FOUND", `Role not found: ${roleId}`);
      }
    }

    await rbacRepository.replaceWorkspaceMemberRoles(member.id, uniqueRoleIds);

    const updatedMember = await rbacRepository.findWorkspaceMember(
      userId,
      workspaceId,
    );

    if (!updatedMember) {
      throw new HttpError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Failed to reload workspace member",
      );
    }

    return toWorkspaceMemberDto(updatedMember);
  },

  async getPermissions({
    scope,
  }: GetPermissionsParams = {}): Promise<ReturnType<typeof toPermissionDto>[]> {
    const permissions = await rbacRepository.findPermissions(scope);
    return permissions.map(toPermissionDto);
  },

  async getWorkspaceRoles(
    workspaceId: string,
  ): Promise<ReturnType<typeof toRoleDto>[]> {
    const roles = await rbacRepository.findWorkspaceRoles(workspaceId);
    return roles.map(toRoleDto);
  },

  async createWorkspaceRole(input: {
    workspaceId: string;
    name: string;
    description?: string | null;
    permissionIds: string[];
  }) {
    const existingRole = await rbacRepository.findRoleByName(
      input.workspaceId,
      input.name,
    );

    if (existingRole) {
      throw new Error("Role name already exists in this workspace");
    }

    const role = await rbacRepository.createWorkspaceRoleWithPermissions({
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description,
      permissionIds: input.permissionIds,
    });

    return toRoleDto(role);
  },

  async updateWorkspaceRole(input: {
    workspaceId: string;
    roleId: string;
    name?: string;
    description?: string | null;
    permissionIds?: string[];
  }) {
    const role = await rbacRepository.findRoleById(input.roleId);

    if (!role || role.workspaceId !== input.workspaceId) {
      throw new Error("Role not found");
    }

    if (role.isSystem || role.scope !== "WORKSPACE") {
      throw new Error("System role cannot be updated");
    }

    if (input.name && input.name !== role.name) {
      const existingRole = await rbacRepository.findRoleByName(
        input.workspaceId,
        input.name,
      );

      if (existingRole) {
        throw new Error("Role name already exists in this workspace");
      }
    }

    const updatedRole = await rbacRepository.updateWorkspaceRoleWithPermissions(
      input.roleId,
      {
        name: input.name,
        description: input.description,
        permissionIds: input.permissionIds,
      },
    );

    if (!updatedRole) {
      throw new Error("Role not found");
    }

    return toRoleDto(updatedRole);
  },

  async deleteWorkspaceRole(input: {
    workspaceId: string;
    roleId: string;
  }) {
    const role = await rbacRepository.findRoleById(input.roleId);

    if (!role || role.workspaceId !== input.workspaceId) {
      throw new Error("Role not found");
    }

    if (role.isSystem || role.scope !== "WORKSPACE") {
      throw new Error("System role cannot be deleted");
    }

    await rbacRepository.deleteWorkspaceRole(input.roleId);
  },
};