import { Router } from "express";
import { userController } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../shared/utils/asyncHandler.js";

export const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler(userController.getUsers));
router.put(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({
      httpMethod: "PUT",
      message: "Update a user",
    });
  }),
);
router.patch(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({
      httpMethod: "PATCH",
      message: "Partially update a user",
    });
  }),
);
