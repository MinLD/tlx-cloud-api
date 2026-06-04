import type { User } from "../../generated/prisma/client.js";
import type { GetUsersResponseDto } from "./user.dto.js";
import { toUserResponseDto } from "./user.mapper.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  async getUsers(): Promise<GetUsersResponseDto> {
    const users = await userRepository.findAll();
    return users.map(toUserResponseDto);
  },

  findById(id: string): Promise<User | null> {
    return userRepository.findById(id);
  },
};
