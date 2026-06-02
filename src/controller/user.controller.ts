import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import type { ApiResponse } from "../shared/types/api.type.js";
import type { GetUsersResponse } from "../shared/types/user.type.js";
import { sendApiResponse } from "../shared/utils/apiResponse.js";

export const userController = {
  async getUsers(_req: Request, res: Response<ApiResponse<GetUsersResponse>>) {
    const users = await userService.getUsers();
    return sendApiResponse(res, 200, "Get users successfully", users);
  },
};
