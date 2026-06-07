import { z } from "zod";

export const workspaceIdParamSchema = z.object({
  workspaceId: z.string().uuid("workspaceId must be a valid UUID"),
});

export const userWorkspacePermissionQuerySchema = z.object({
  userId: z.string().uuid("userId must be a valid UUID"),
  permissionKey: z.string().min(1, "permissionKey is required"),
});

export const userWorkspaceRoleQuerySchema = z.object({
  userId: z.string().uuid("userId must be a valid UUID"),
  roleNames: z
    .string()
    .min(1, "roleNames is required")
    .transform((value) =>
      value
        .split(",")
        .map((roleName) => roleName.trim())
        .filter(Boolean),
    ),
});

export const updateWorkspaceMemberRoleBodySchema = z.object({
  userId: z.string().uuid("userId must be a valid UUID"),
  roleIds: z
    .array(z.string().uuid("roleId must be a valid UUID"))
    .min(1, "roleIds is required"),
});

export const createWorkspaceRoleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  permissionIds: z.array(z.string().uuid()).default([]),
});

export const updateWorkspaceRoleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
});
