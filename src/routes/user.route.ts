import { Router } from "express";
import { userController } from "../controller/user.controller.js";

export const router = Router();

router.get("/", userController.getUsers);
router.put("/", (_req, res) => {
  res.json({
    httpMethod: "PUT",
    message: "Update a user",
  });
});
router.patch("/", (_req, res) => {
  res.json({
    httpMethod: "PATCH",
    message: "Partially update a user",
  });
});


