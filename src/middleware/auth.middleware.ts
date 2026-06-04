import type { NextFunction, Request, Response } from "express";
import { ACCESS_COOKIE_NAME } from "../modules/auth/auth.cookie.js";
import { authService } from "../modules/auth/auth.service.js";
import { HttpError } from "../shared/errors/http.error.js";

const getBearerToken = (req: Request): string | undefined => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length).trim() || undefined;
};

const getCookieToken = (req: Request): string | undefined => {
  const cookies = req.cookies as Record<string, string | undefined> | undefined;
  return cookies?.[ACCESS_COOKIE_NAME];
};

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = getBearerToken(req) ?? getCookieToken(req);

    if (!token) {
      throw new HttpError(401, "UNAUTHORIZED", "Unauthorized: No token provided");
    }

    req.user = await authService.authenticateAccessToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
};
