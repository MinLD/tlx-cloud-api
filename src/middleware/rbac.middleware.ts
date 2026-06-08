import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../shared/errors/http.error.js";
import { rbacService } from "../modules/rbac/rbac.service.js";
import type { PermissionKey } from "../shared/permissions/permission.keys.js";

type RequirePermissionOptions = {
  getWorkspaceId?: (req: Request) => string | undefined;
};

type RequireRoleOptions = {
  getWorkspaceId?: (req: Request) => string | undefined;
};

const defaultGetWorkspaceId = (req: Request): string | undefined => {
  const workspaceId = req.params.workspaceId ?? req.body?.workspaceId ?? req.query.workspaceId;

  if (Array.isArray(workspaceId)) {
    return workspaceId[0];
  }

  return workspaceId?.toString();
};
  
export const requirePermission = (
  permissionKey: PermissionKey | string,
  options: RequirePermissionOptions = {}
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new HttpError(401, "UNAUTHORIZED", "Unauthorized");
      }

      const workspaceId = options.getWorkspaceId?.(req) ?? defaultGetWorkspaceId(req);

      if (!workspaceId) {
        throw new HttpError(400, "BAD_REQUEST", "workspaceId is required");
      }

      const allowed = await rbacService.hasPermission({
        userId: req.user.id,
        workspaceId,
        permissionKey
      });

      if (!allowed) {
        throw new HttpError(403, "FORBIDDEN", "Forbidden");
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export const requireRole = (
  roleNames: string[],
  options: RequireRoleOptions = {}
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new HttpError(401, "UNAUTHORIZED", "Unauthorized");
      }

      const workspaceId = options.getWorkspaceId?.(req) ?? defaultGetWorkspaceId(req);

      if (!workspaceId) {
        throw new HttpError(400, "BAD_REQUEST", "workspaceId is required");
      }

      const allowed = await rbacService.hasRole({
        userId: req.user.id,
        workspaceId,
        roleNames
      });

      if (!allowed) {
        throw new HttpError(403, "FORBIDDEN", "Forbidden");
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};