import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().email("email must be valid"),
  roleIds: z
    .array(z.string().uuid("roleId must be valid"))
    .min(1, "roleIds is required"),
  expiresAt: z.string().datetime().optional(),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, "token is required"),
});

export const rejectInvitationSchema = z.object({
  token: z.string().min(1, "token is required"),
});

export const updateMemberRolesSchema = z.object({
  roleIds: z
    .array(z.string().uuid("roleId must be valid"))
    .min(1, "roleIds is required"),
});
