import type { Response } from "express";
import { env } from "../../config/env.js";

export const ACCESS_COOKIE_NAME = "accessToken";
export const REFRESH_COOKIE_NAME = "refreshToken";

const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge,
});

export const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie(ACCESS_COOKIE_NAME, token, cookieOptions(ACCESS_COOKIE_MAX_AGE));
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE_NAME, token, cookieOptions(REFRESH_COOKIE_MAX_AGE));
};

export const clearAuthCookies = (res: Response) => {
  res.cookie(ACCESS_COOKIE_NAME, "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.cookie(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
};
