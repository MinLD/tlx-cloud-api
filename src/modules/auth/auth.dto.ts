import type { z } from "zod";
import type { UserResponseDto } from "../users/user.dto.js";
import type { loginBodySchema, registerBodySchema } from "./auth.schema.js";

export type RegisterBodyDto = z.infer<typeof registerBodySchema>;

export type LoginBodyDto = z.infer<typeof loginBodySchema>;

export type AuthUserResponseDto = Pick<UserResponseDto, "id" | "name" | "email">;

export type RegisterResponseDto = AuthUserResponseDto;

export type LoginResponseDto = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshResponseDto = {
  accessToken: string;
};

export type IdentityResponseDto = {
  user: AuthUserResponseDto;
  roles: string[];
  permissions: string[];
};
