import type {
  Permission,
  Role,
  RolePermission,
  WorkspaceMember,
  WorkspaceMemberRole,
} from "../../generated/prisma/client.js";
import type {
  PermissionDto,
  RoleDto,
  RolePermissionDto,
  WorkspaceMemberDto,
} from "./rbac.dto.js";

export const toPermissionDto = (permission: Permission): PermissionDto => ({
  id: permission.id,
  key: permission.key,
  description: permission.description,
});

export const toRolePermissionDto = (
  rolePermission: RolePermission & {
    permission: Permission;
  },
): RolePermissionDto => ({
  id: rolePermission.id,
  roleId: rolePermission.roleId,
  permissionId: rolePermission.permissionId,
  permission: toPermissionDto(rolePermission.permission),
});


export const toRoleDto = (
  role: Role & {
    rolePermissions?: Array<
      RolePermission & {
        permission: Permission;
      }
    >;
  },
): RoleDto => ({
  id: role.id,
  workspaceId: role.workspaceId,
  name: role.name,
  description: role.description,
  isSystem: role.isSystem,
  permissions: (role.rolePermissions ?? []).map((rolePermission) =>
    toPermissionDto(rolePermission.permission),
  ),
});

export const toWorkspaceMemberRoleDto = (
  memberRole: WorkspaceMemberRole & {
    role: Role & {
      rolePermissions?: Array<
        RolePermission & {
          permission: Permission;
        }
      >;
    };
  },
): RoleDto => toRoleDto(memberRole.role);

export const toWorkspaceMemberDto = (
  member: WorkspaceMember & {
    roles?: Array<
      WorkspaceMemberRole & {
        role: Role & {
          rolePermissions?: Array<
            RolePermission & {
              permission: Permission;
            }
          >;
        };
      }
    >;
  },
): WorkspaceMemberDto => ({
  id: member.id,
  userId: member.userId,
  workspaceId: member.workspaceId,
  roles: (member.roles ?? []).map((memberRole) => toRoleDto(memberRole.role)),
});

