import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/rbac.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { PERMISSIONS } from "../../shared/permissions/permission.keys.js";
import { rbacController } from "./rbac.controller.js";
import {
  createWorkspaceRoleSchema,
  updateWorkspaceMemberRoleBodySchema,
  updateWorkspaceRoleSchema,
} from "./rbac.schema.js";
import { validateBody } from "../../shared/validation/validation.js";

export const rbacRouter = Router();

rbacRouter.use(authMiddleware);

rbacRouter.get(
  "/workspaces/:workspaceId/member",
  requirePermission(PERMISSIONS.MEMBER_READ),
  asyncHandler(rbacController.getWorkspaceMembers),
);
rbacRouter.get(
  "/workspaces/:workspaceId/permission",
  requirePermission(PERMISSIONS.ROLE_READ),
  asyncHandler(rbacController.checkPermission),
);
rbacRouter.get(
  "/workspaces/:workspaceId/role",
  requirePermission(PERMISSIONS.ROLE_READ),
  asyncHandler(rbacController.checkRole),
);
rbacRouter.patch(
  "/workspaces/:workspaceId/member",
  requirePermission(PERMISSIONS.MEMBER_UPDATE_ROLE),
  validateBody(updateWorkspaceMemberRoleBodySchema),
  asyncHandler(rbacController.updateWorkspaceMemberRoles),
);

rbacRouter.get(
  "/permissions",
  asyncHandler(rbacController.getPermissions),
);

rbacRouter.get(
  "/workspaces/:workspaceId/roles",
  requirePermission(PERMISSIONS.ROLE_READ),
  rbacController.getWorkspaceRoles,
);

rbacRouter.post(
  "/workspaces/:workspaceId/roles",
  requirePermission(PERMISSIONS.ROLE_CREATE),
  validateBody(createWorkspaceRoleSchema),
  rbacController.createWorkspaceRole,
);

rbacRouter.patch(
  "/workspaces/:workspaceId/roles/:roleId",
  requirePermission(PERMISSIONS.ROLE_UPDATE),
  validateBody(updateWorkspaceRoleSchema),
  rbacController.updateWorkspaceRole,
);

rbacRouter.delete(
  "/workspaces/:workspaceId/roles/:roleId",
  requirePermission(PERMISSIONS.ROLE_DELETE),
  rbacController.deleteWorkspaceRole,
);
