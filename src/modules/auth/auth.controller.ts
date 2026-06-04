import type { Request, Response } from "express";
import type { ApiResponse } from "../../shared/types/api.type.js";
import { sendApiResponse } from "../../shared/utils/apiResponse.js";
import { clearAuthCookie, setAuthCookie } from "./auth.cookie.js";
import type {
  LoginBodyDto,
  LoginResponseDto,
  RegisterBodyDto,
  RegisterResponseDto,
} from "./auth.dto.js";
import { authService } from "./auth.service.js";

type RegisterRequest = Request<unknown, unknown, RegisterBodyDto>;
type LoginRequest = Request<unknown, unknown, LoginBodyDto>;

export const authController = {
  async register(req: RegisterRequest, res: Response<ApiResponse<RegisterResponseDto>>) {
    const user = await authService.register(req.body);
    return sendApiResponse(res, 201, "User registered successfully", user);
  },

  async login(req: LoginRequest, res: Response<ApiResponse<LoginResponseDto>>) {
    const result = await authService.login(req.body);
    setAuthCookie(res, result.accessToken);

    return sendApiResponse(res, 200, "Login successful", result);
  },

  async logout(_req: Request, res: Response<ApiResponse<null>>) {
    clearAuthCookie(res);
    return sendApiResponse(res, 200, "Logout successful", null);
  },
};
