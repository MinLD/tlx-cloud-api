import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { userController } from "./user.controller.js";

export const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get("/", asyncHandler(userController.getUsers));
