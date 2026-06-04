import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { validateBody } from "../../shared/validation/validation.js";
import { authController } from "./auth.controller.js";
import { loginBodySchema, registerBodySchema } from "./auth.schema.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerBodySchema), asyncHandler(authController.register));
authRouter.post("/login", validateBody(loginBodySchema), asyncHandler(authController.login));
authRouter.post("/refresh", asyncHandler(authController.refresh));
authRouter.post("/logout", asyncHandler(authController.logout));
