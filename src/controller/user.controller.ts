import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";

export const userController = {
  async getUsers(_req: Request, res: Response) {
    const users = await userService.getUsers();

    res.status(200).json({
      success: true,
      data: users
    });
  }
};