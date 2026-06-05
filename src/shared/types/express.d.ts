import type { IdentityResponseDto } from "../../modules/auth/auth.dto.js";

declare global {
  namespace Express {
    interface Request {
      identity?: IdentityResponseDto;
      user?: IdentityResponseDto["user"];
      requestId?: string;
      validatedQuery?: unknown;
    }
  }
}

export {};
