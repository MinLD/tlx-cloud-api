import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});
