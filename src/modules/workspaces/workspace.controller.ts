import type { Request, Response } from "express";
import type { ApiResponse } from "../../shared/types/api.type.js";
import { sendApiResponse } from "../../shared/utils/apiResponse.js";
import type {
  CreateWorkspaceInputDto,
  DeleteWorkspaceResponseDto,
  GetWorkspaceResponseDto,
  GetWorkspacesResponseDto,
  UpdateWorkspaceInputDto,
} from "./workspace.dto.js";
import { workspaceService } from "./workspace.service.js";

export const workspaceController = {
  async getWorkspaces(
    req: Request,
    res: Response<ApiResponse<GetWorkspacesResponseDto>>,
  ) {
    const userId = req.user!.id;
    const result = await workspaceService.getWorkspaces(userId);
    return sendApiResponse(res, 200, "Get workspaces successfully", result);
  },

  async getWorkspace(
    req: Request,
    res: Response<ApiResponse<GetWorkspaceResponseDto>>,
  ) {
    const userId = req.user!.id;
    const { workspaceId } = req.params as { workspaceId: string };
    const result = await workspaceService.getWorkspaceById(userId, workspaceId);
    return sendApiResponse(res, 200, "Get workspace successfully", result);
  },

  async createWorkspace(
    req: Request<unknown, unknown, CreateWorkspaceInputDto>,
    res: Response<ApiResponse<GetWorkspaceResponseDto>>,
  ) {
    const userId = req.user!.id;
    const result = await workspaceService.createWorkspace(userId, req.body);
    return sendApiResponse(res, 201, "Create workspace successfully", result);
  },

  async updateWorkspace(
    req: Request<unknown, unknown, UpdateWorkspaceInputDto>,
    res: Response<ApiResponse<GetWorkspaceResponseDto>>,
  ) {
    const userId = req.user!.id;
    const { workspaceId } = req.params as { workspaceId: string };
    const result = await workspaceService.updateWorkspace(
      userId,
      workspaceId,
      req.body,
    );
    return sendApiResponse(res, 200, "Update workspace successfully", result);
  },

  async deleteWorkspace(
    req: Request,
    res: Response<ApiResponse<DeleteWorkspaceResponseDto>>,
  ) {
    const userId = req.user!.id;
    const { workspaceId } = req.params as { workspaceId: string };
    const result = await workspaceService.deleteWorkspace(userId, workspaceId);
    return sendApiResponse(res, 200, "Delete workspace successfully", result);
  },
};
