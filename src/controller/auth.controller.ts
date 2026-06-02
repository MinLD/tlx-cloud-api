import type { Request, Response } from "express";
import type { ApiResponse } from "../shared/types/api.type.js";
import { AuthError } from "../shared/errors/auth.error.js";
import { HttpError } from "../shared/errors/http.error.js";
import type {
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
} from "../shared/types/auth.type.js";
import { authService } from "../services/auth.service.js";
import { clearAuthCookie, setAuthCookie } from "../shared/utils/authCookie.js";

type RegisterRequest = Request<unknown, unknown, RegisterBody>;
type LoginRequest = Request<unknown, unknown, LoginBody>;

type RegisterApiResponse = ApiResponse<RegisterResponse>;
type LoginApiResponse = ApiResponse<LoginResponse>;

const register = async (req: RegisterRequest, res: Response<RegisterApiResponse>) => {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof AuthError && error.code === "USER_ALREADY_EXISTS") {
      throw new HttpError(409, "CONFLICT", "User already exists with this email");
    }

    throw error;
  }
};

const login = async (req: LoginRequest, res: Response<LoginApiResponse>) => {
  try {
    const result = await authService.login(req.body);
    setAuthCookie(res, result.accessToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    if (error instanceof AuthError && error.code === "INVALID_EMAIL") {
      throw new HttpError(401, "UNAUTHORIZED", "Invalid email");
    }

    if (error instanceof AuthError && error.code === "INVALID_PASSWORD") {
      throw new HttpError(401, "UNAUTHORIZED", "Invalid password");
    }

    throw error;
  }
};

const logout = async (_req: Request, res: Response<ApiResponse<null>>) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
    data: null,
  });
};

export { register, login, logout };
