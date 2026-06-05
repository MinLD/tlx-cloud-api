import type { Request, Response } from "express";
import type { ApiResponse } from "../../shared/types/api.type.js";
import { sendApiResponse } from "../../shared/utils/apiResponse.js";
import type { GetAllUserQueryDto, GetUsersResponseDto } from "./user.dto.js";
import { userService } from "./user.service.js";

export const userController = {
  async getAllUser(req: Request, res: Response<ApiResponse<GetUsersResponseDto>>) {
    const users = await userService.getAllUser(req.validatedQuery as GetAllUserQueryDto);
    return sendApiResponse(res, 200, "Get users successfully", users);
  },
};
