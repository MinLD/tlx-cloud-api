import type { User } from "../../generated/prisma/client.js";
import type { PaginationResult } from "../../shared/types/pagination.type.js";
import type { z } from "zod";
import type { getAllUserQuerySchema } from "./user.schema.js";

export type UserResponseDto = Pick<User, "id" | "name" | "email" | "createdAt">;

export type GetAllUserQueryDto = z.infer<typeof getAllUserQuerySchema>;

export type GetUsersResponseDto = PaginationResult<UserResponseDto>;
