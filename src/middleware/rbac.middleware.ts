import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../shared/errors/http.error.js";

const getIdentity = (req: Request) => {
  if (!req.identity) {
    throw new HttpError(401, "UNAUTHORIZED", "Unauthorized: No identity found");
  }

  return req.identity;
};

export const requireRole = (...roles: string[]) => (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const identity = getIdentity(req);
    const hasRole = roles.some((role) => identity.roles.includes(role));

    if (!hasRole) {
      throw new HttpError(403, "FORBIDDEN", "Forbidden: missing required role");
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const requirePermission = (...permissions: string[]) => (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const identity = getIdentity(req);
    const hasPermission = permissions.some((permission) =>
      identity.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new HttpError(403, "FORBIDDEN", "Forbidden: missing required permission");
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireAllPermissions = (...permissions: string[]) => (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const identity = getIdentity(req);
    const hasAllPermissions = permissions.every((permission) =>
      identity.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new HttpError(403, "FORBIDDEN", "Forbidden: missing required permission");
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
