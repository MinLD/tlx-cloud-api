import type { User } from "../../generated/prisma/client.js";
import { createPaginationResult, getPaginationOffset } from "../../shared/utils/pagination.js";
import type { GetAllUserQueryDto, GetUsersResponseDto } from "./user.dto.js";
import { toUserResponseDto } from "./user.mapper.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  async getAllUser(query: GetAllUserQueryDto): Promise<GetUsersResponseDto> {
    const [users, totalItems] = await userRepository.findAll({
      skip: getPaginationOffset(query),
      take: query.limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return createPaginationResult(users.map(toUserResponseDto), totalItems, query);
  },

  findById(id: string): Promise<User | null> {
    return userRepository.findById(id);
  },
};
