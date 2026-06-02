import type { Response } from "express";
import { env } from "../../config/env.js";

const AUTH_COOKIE_NAME = "jwt";
const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
};

export const clearAuthCookie = (res: Response) => {
  res.cookie(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
};