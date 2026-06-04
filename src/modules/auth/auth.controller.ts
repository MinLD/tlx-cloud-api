import type { Request, Response } from "express";
import type { ApiResponse } from "../../shared/types/api.type.js";
import { HttpError } from "../../shared/errors/http.error.js";
import { sendApiResponse } from "../../shared/utils/apiResponse.js";
import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "./auth.cookie.js";
import type {
  LoginBodyDto,
  LoginResponseDto,
  RefreshResponseDto,
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
    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);

    return sendApiResponse(res, 200, "Login successful", result);
  },

  async refresh(req: Request, res: Response<ApiResponse<RefreshResponseDto>>) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken || typeof refreshToken !== "string") {
      throw new HttpError(401, "UNAUTHORIZED", "Unauthorized: No refresh token provided");
    }

    const result = await authService.refresh(refreshToken);
    setAccessTokenCookie(res, result.accessToken);

    return sendApiResponse(res, 200, "Token refreshed successfully", result);
  },

  async logout(_req: Request, res: Response<ApiResponse<null>>) {
    clearAuthCookies(res);
    return sendApiResponse(res, 200, "Logout successful", null);
  },
};
