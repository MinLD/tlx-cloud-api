import { userRepository } from "../repositories/user.repository.js";
import type { GetUsersResponse } from "../shared/types/user.type.js";

export const userService = {
  async getUsers(): Promise<GetUsersResponse> {
    return userRepository.findAll();
  },
};
