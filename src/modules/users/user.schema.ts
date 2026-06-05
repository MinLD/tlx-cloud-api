import { z } from "zod";
import { paginationQuerySchema } from "../../shared/validation/pagination.schema.js";

export const userIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

export const getAllUserQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
