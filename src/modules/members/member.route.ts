import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/rbac.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { validateBody } from "../../shared/validation/validation.js";
import { PERMISSIONS } from "../../shared/permissions/permission.keys.js";
import { memberController } from "./member.controller.js";
import {
  acceptInvitationSchema,
  createInvitationSchema,
  rejectInvitationSchema,
  updateMemberRolesSchema,
} from "./member.schema.js";

export const memberRouter = Router();

memberRouter.use(authMiddleware);

memberRouter.get(
  "/workspaces/:workspaceId/members",
  requirePermission(PERMISSIONS.MEMBER_READ),
  asyncHandler(memberController.getMembers),
);

memberRouter.get(
  "/workspaces/:workspaceId/invitations/pending",
  requirePermission(PERMISSIONS.MEMBER_READ),
  asyncHandler(memberController.listPendingInvitations),
);

memberRouter.post(
  "/workspaces/:workspaceId/invitations",
  requirePermission(PERMISSIONS.MEMBER_INVITE),
  validateBody(createInvitationSchema),
  asyncHandler(memberController.inviteMember),
);

memberRouter.post(
  "/invitations/:invitationId/accept",
  validateBody(acceptInvitationSchema),
  asyncHandler(memberController.acceptInvitation),
);

memberRouter.post(
  "/invitations/:invitationId/reject",
  validateBody(rejectInvitationSchema),
  asyncHandler(memberController.rejectInvitation),
);

memberRouter.post(
  "/invitations/:invitationId/revoke",
  requirePermission(PERMISSIONS.MEMBER_INVITE),
  asyncHandler(memberController.revokeInvitation),
);

memberRouter.patch(
  "/workspaces/:workspaceId/members/:memberId/roles",
  requirePermission(PERMISSIONS.MEMBER_UPDATE_ROLE),
  validateBody(updateMemberRolesSchema),
  asyncHandler(memberController.updateMemberRoles),
);

memberRouter.delete(
  "/workspaces/:workspaceId/members/:memberId",
  requirePermission(PERMISSIONS.MEMBER_REMOVE),
  asyncHandler(memberController.removeMember),
);

memberRouter.post(
  "/workspaces/:workspaceId/leave",
  asyncHandler(memberController.leaveWorkspace),
);
