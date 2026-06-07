import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/rbac.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { validateBody } from "../../shared/validation/validation.js";
import { workspaceController } from "./workspace.controller.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "./workspace.schema.js";
import { PERMISSIONS } from "../../shared/permissions/permission.keys.js";

export const workspaceRouter = Router();

workspaceRouter.use(authMiddleware);

workspaceRouter.get("/", asyncHandler(workspaceController.getWorkspaces));

workspaceRouter.get(
  "/:workspaceId",
  requirePermission(PERMISSIONS.WORKSPACE_READ),
  asyncHandler(workspaceController.getWorkspace),
);

workspaceRouter.post(
  "/",
  validateBody(createWorkspaceSchema),
  asyncHandler(workspaceController.createWorkspace),
);
workspaceRouter.patch(
  "/:workspaceId",
  requirePermission(PERMISSIONS.WORKSPACE_UPDATE),
  validateBody(updateWorkspaceSchema),
  asyncHandler(workspaceController.updateWorkspace),
);
workspaceRouter.delete(
  "/:workspaceId",
  requirePermission(PERMISSIONS.WORKSPACE_DELETE),
  asyncHandler(workspaceController.deleteWorkspace),
);
