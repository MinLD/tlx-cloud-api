import type { User } from "../../generated/prisma/client.js";
import type { UserResponseDto } from "./user.dto.js";

export const toUserResponseDto = (
  user: Pick<User, "id" | "name" | "email" | "createdAt">,
): UserResponseDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});
