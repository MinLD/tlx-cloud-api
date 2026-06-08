import type {
  Permission,
  Role,
  RolePermission,
  WorkspaceMember,
} from "../../generated/prisma/client.js";

export type PermissionDto = Pick<Permission, "id" | "key" | "description">;

export type RolePermissionDto = Pick<
  RolePermission,
  "id" | "roleId" | "permissionId"
> & {
  permission: PermissionDto;
};

export type RoleDto = Pick<
  Role,
  "id" | "workspaceId" | "name" | "description" | "isSystem"
> & {
  permissions: PermissionDto[];
};

export type WorkspaceMemberDto = Pick<
  WorkspaceMember,
  "id" | "userId" | "workspaceId"
> & {
  roles: RoleDto[];
};

export type HasPermissionResponseDto = {
  allowed: boolean;
};

export type UpdateWorkspaceMemberRolesResponseDto = {
  member: WorkspaceMemberDto;
};

// PermissionDto

export type CreateWorkspaceRoleRequestDto = {
  name: string;
  description?: string | null;
  permissionIds: string[];
};

export type UpdateWorkspaceRoleRequestDto = {
  name?: string;
  description?: string | null;
  permissionIds?: string[];
};

export type CreateWorkspaceRoleResponseDto = {
  role: RoleDto;
};

export type UpdateWorkspaceRoleResponseDto = {
  role: RoleDto;
};
