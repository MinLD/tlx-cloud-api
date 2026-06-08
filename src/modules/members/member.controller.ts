import type { Request, Response } from "express";
import type { ApiResponse } from "../../shared/types/api.type.js";
import { sendApiResponse } from "../../shared/utils/apiResponse.js";
import { memberService } from "./member.service.js";
import type {
  AcceptInvitationResponseDto,
  GetMembersResponseDto,
  GetPendingInvitationsResponseDto,
  InviteMemberResponseDto,
  RejectInvitationResponseDto,
  RevokeInvitationResponseDto,
  SimpleActionResponseDto,
  UpdateMemberRolesResponseDto,
} from "./member.dto.js";

export const memberController = {
  async getMembers(
    req: Request,
    res: Response<ApiResponse<GetMembersResponseDto>>,
  ) {
    const { workspaceId } = req.params as { workspaceId: string };
    const result = await memberService.getMembers(workspaceId);
    return sendApiResponse(res, 200, "Get members successfully", result);
  },

  async listPendingInvitations(
    req: Request,
    res: Response<ApiResponse<GetPendingInvitationsResponseDto>>,
  ) {
    const { workspaceId } = req.params as { workspaceId: string };
    const result = await memberService.listPendingInvitations(workspaceId);
    return sendApiResponse(
      res,
      200,
      "Get pending invitations successfully",
      result,
    );
  },

  async inviteMember(
    req: Request,
    res: Response<ApiResponse<InviteMemberResponseDto>>,
  ) {
    const { workspaceId } = req.params as { workspaceId: string };
    const userId = req.user!.id;

    const result = await memberService.inviteMember({
      workspaceId,
      invitedById: userId,
      email: req.body.email,
      roleIds: req.body.roleIds,
      expiresAt: req.body.expiresAt,
    });

    return sendApiResponse(res, 201, "Invite member successfully", result);
  },

  async acceptInvitation(
    req: Request,
    res: Response<ApiResponse<AcceptInvitationResponseDto>>,
  ) {
    const userId = req.user!.id;
    const { token } = req.body as { token: string };

    const result = await memberService.acceptInvitation(token, userId);
    return sendApiResponse(res, 200, "Accept invitation successfully", result);
  },

  async rejectInvitation(
    req: Request,
    res: Response<ApiResponse<RejectInvitationResponseDto>>,
  ) {
    const { token } = req.body as { token: string };

    const result = await memberService.rejectInvitation(token);
    return sendApiResponse(res, 200, "Reject invitation successfully", result);
  },

  async revokeInvitation(
    req: Request,
    res: Response<ApiResponse<RevokeInvitationResponseDto>>,
  ) {
    const { invitationId } = req.params as { invitationId: string };

    const result = await memberService.revokeInvitation(invitationId);
    return sendApiResponse(res, 200, "Revoke invitation successfully", result);
  },

  async updateMemberRoles(
    req: Request,
    res: Response<ApiResponse<UpdateMemberRolesResponseDto>>,
  ) {
    const { workspaceId, memberId } = req.params as {
      workspaceId: string;
      memberId: string;
    };

    const result = await memberService.updateMemberRoles(
      workspaceId,
      memberId,
      req.body.roleIds,
    );

    return sendApiResponse(res, 200, "Update member roles successfully", result);
  },

  async removeMember(
    req: Request,
    res: Response<ApiResponse<SimpleActionResponseDto>>,
  ) {
    const { workspaceId, memberId } = req.params as {
      workspaceId: string;
      memberId: string;
    };

    const result = await memberService.removeMember(workspaceId, memberId);
    return sendApiResponse(res, 200, "Remove member successfully", result);
  },

  async leaveWorkspace(
    req: Request,
    res: Response<ApiResponse<SimpleActionResponseDto>>,
  ) {
    const userId = req.user!.id;
    const { workspaceId } = req.params as { workspaceId: string };

    const result = await memberService.leaveWorkspace(workspaceId, userId);
    return sendApiResponse(res, 200, "Leave workspace successfully", result);
  },
};
