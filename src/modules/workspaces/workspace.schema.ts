import { z } from "zod";

const slugSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase, alphanumeric, and can include hyphens.",
  );

const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(100),
  slug: slugSchema.optional(),
});

const updateWorkspaceSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    slug: slugSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.slug !== undefined, {
    message: "At least one field is required",
  });

export { createWorkspaceSchema, updateWorkspaceSchema };
