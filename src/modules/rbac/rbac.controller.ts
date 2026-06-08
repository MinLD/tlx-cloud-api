import type { Request, Response } from "express";
import type { ApiResponse } from "../../shared/types/api.type.js";
import { sendApiResponse } from "../../shared/utils/apiResponse.js";
import type {
  CreateWorkspaceRoleRequestDto,
  CreateWorkspaceRoleResponseDto,
  HasPermissionResponseDto,
  PermissionDto,
  RoleDto,
  UpdateWorkspaceMemberRolesResponseDto,
  UpdateWorkspaceRoleRequestDto,
  UpdateWorkspaceRoleResponseDto,
  WorkspaceMemberDto,
} from "./rbac.dto.js";
import {
  PERMISSION_SCOPE,
  type PermissionScope,
} from "../../shared/permissions/permission.keys.js";
import { rbacService } from "./rbac.service.js";

const toSingleString = (value: unknown): string => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }

  return typeof value === "string" ? value : "";
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return typeof value === "string"
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
};

export const rbacController = {
  async getWorkspaceMember(
    req: Request,
    res: Response<ApiResponse<WorkspaceMemberDto | null>>,
  ) {
    const query = req.query as Record<string, unknown>;
    const params = req.params as Record<string, unknown>;

    const member = await rbacService.getWorkspaceMember(
      toSingleString(query.userId),
      toSingleString(params.workspaceId),
    );

    return sendApiResponse(
      res,
      200,
      "Get workspace member successfully",
      member,
    );
  },

  async checkPermission(
    req: Request,
    res: Response<ApiResponse<HasPermissionResponseDto>>,
  ) {
    const query = req.query as Record<string, unknown>;
    const params = req.params as Record<string, unknown>;

    const allowed = await rbacService.hasPermission({
      userId: toSingleString(query.userId),
      workspaceId: toSingleString(params.workspaceId),
      permissionKey: toSingleString(query.permissionKey),
    });

    return sendApiResponse(res, 200, "Check permission successfully", {
      allowed,
    });
  },

  async checkRole(
    req: Request,
    res: Response<ApiResponse<HasPermissionResponseDto>>,
  ) {
    const query = req.query as Record<string, unknown>;
    const params = req.params as Record<string, unknown>;
    const roleNamesValue = toSingleString(query.roleNames);

    const allowed = await rbacService.hasRole({
      userId: toSingleString(query.userId),
      workspaceId: toSingleString(params.workspaceId),
      roleNames: roleNamesValue
        ? roleNamesValue
            .split(",")
            .map((roleName) => roleName.trim())
            .filter(Boolean)
        : [],
    });

    return sendApiResponse(res, 200, "Check role successfully", {
      allowed,
    });
  },

  async getWorkspaceMembers(
    req: Request,
    res: Response<ApiResponse<WorkspaceMemberDto[]>>,
  ) {
    const params = req.params as Record<string, unknown>;

    const members = await rbacService.getWorkspaceMembers(
      toSingleString(params.workspaceId),
    );

    return sendApiResponse(
      res,
      200,
      "Get workspace members successfully",
      members,
    );
  },
  async updateWorkspaceMemberRoles(
    req: Request,
    res: Response<ApiResponse<UpdateWorkspaceMemberRolesResponseDto>>,
  ) {
    const params = req.params as Record<string, unknown>;
    const body = req.body as Record<string, unknown>;

    const member = await rbacService.updateWorkspaceMemberRoles({
      workspaceId: toSingleString(params.workspaceId),
      userId: toSingleString(body.userId),
      roleIds: toStringArray(body.roleIds),
    });

    return sendApiResponse(
      res,
      200,
      "Update workspace member role successfully",
      {
        member,
      },
    );
  },
  async getPermissions(
    req: Request,
    res: Response<ApiResponse<PermissionDto[]>>,
  ) {
    const query = req.query as Record<string, unknown>;
    const scope = toSingleString(query.scope).toLowerCase();
    const permissionScope: PermissionScope | undefined =
      scope === PERMISSION_SCOPE.SYSTEM || scope === PERMISSION_SCOPE.WORKSPACE
        ? scope
        : undefined;

    const permissions = (await rbacService.getPermissions({
      scope: permissionScope,
    })) as PermissionDto[];

    return sendApiResponse(
      res,
      200,
      "Get permissions successfully",
      permissions,
    );
  },

  async getWorkspaceRoles(
    req: Request,
    res: Response<ApiResponse<RoleDto[]>>,
  ) {
    const params = req.params as Record<string, unknown>;

    const roles = (await rbacService.getWorkspaceRoles(
      toSingleString(params.workspaceId),
    )) as RoleDto[];

    return sendApiResponse(res, 200, "Get workspace roles successfully", roles);
  },

  async createWorkspaceRole(
    req: Request,
    res: Response<ApiResponse<CreateWorkspaceRoleResponseDto>>,
  ) {
    const params = req.params as Record<string, unknown>;
    const body = req.body as CreateWorkspaceRoleRequestDto;

    const role = await rbacService.createWorkspaceRole({
      workspaceId: toSingleString(params.workspaceId),
      name: body.name,
      description: body.description,
      permissionIds: body.permissionIds,
    });

    return sendApiResponse(res, 201, "Create workspace role successfully", {
      role,
    });
  },

  async updateWorkspaceRole(
    req: Request,
    res: Response<ApiResponse<UpdateWorkspaceRoleResponseDto>>,
  ) {
    const params = req.params as Record<string, unknown>;
    const body = req.body as UpdateWorkspaceRoleRequestDto;

    const role = await rbacService.updateWorkspaceRole({
      workspaceId: toSingleString(params.workspaceId),
      roleId: toSingleString(params.roleId),
      name: body.name,
      description: body.description,
      permissionIds: body.permissionIds,
    });

    return sendApiResponse(res, 200, "Update workspace role successfully", {
      role,
    });
  },

  async deleteWorkspaceRole(
    req: Request,
    res: Response<ApiResponse<null>>,
  ) {
    const params = req.params as Record<string, unknown>;

    await rbacService.deleteWorkspaceRole({
      workspaceId: toSingleString(params.workspaceId),
      roleId: toSingleString(params.roleId),
    });

    return sendApiResponse(res, 200, "Delete workspace role successfully", null);
  },
};
