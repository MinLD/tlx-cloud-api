import { Router } from "express";
import { login, register, logout } from "../controller/auth.controller.js";
import { loginBodySchema, registerBodySchema } from "../modules/auth/auth.schema.js";
import { asyncHandler } from "../shared/utils/asyncHandler.js";
import { validateBody } from "../shared/validation/validation.js";

export const router = Router();

router.post("/register", validateBody(registerBodySchema), asyncHandler(register));
router.post("/login", validateBody(loginBodySchema), asyncHandler(login));
router.post("/logout", asyncHandler(logout));
