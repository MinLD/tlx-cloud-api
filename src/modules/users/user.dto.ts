import type { User } from "../../generated/prisma/client.js";

export type UserResponseDto = Pick<User, "id" | "name" | "email" | "createdAt">;

export type GetUsersResponseDto = UserResponseDto[];
