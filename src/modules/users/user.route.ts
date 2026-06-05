import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/rbac.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { validateQuery } from "../../shared/validation/validation.js";
import { userController } from "./user.controller.js";
import { getAllUserQuerySchema } from "./user.schema.js";

export const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get(
  "/",
  validateQuery(getAllUserQuerySchema),
  requireRole("ADMIN"),
  asyncHandler(userController.getAllUser),
);
