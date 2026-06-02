import { z } from "zod";
import type { LoginBody, RegisterBody } from "../../shared/types/auth.type.js";

export const registerBodySchema = z.object({
  name: z.string().trim().min(2, "name must be at least 2 characters"),
  email: z.string().trim().email("email must be valid"),
  password: z.string().min(6, "password must be at least 6 characters"),
}) satisfies z.ZodType<RegisterBody>;

export const loginBodySchema = z.object({
  email: z.string().trim().email("email must be valid"),
  password: z.string().min(1, "password is required"),
}) satisfies z.ZodType<LoginBody>;