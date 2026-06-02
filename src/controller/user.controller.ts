import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import type { ApiResponse } from "../shared/types/api.type.js";
import type { GetUsersResponse } from "../shared/types/user.type.js";

export const userController = {
  async getUsers(_req: Request, res: Response<ApiResponse<GetUsersResponse>>) {
    const users = await userService.getUsers();
    return res.status(200).json({
      success: true,
      message: "Get users successfully",
      data: users,
    });
  },
};
