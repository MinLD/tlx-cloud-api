import { rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";

export const rateLimitMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "test",
  message: {
    success: false,
    message: "Too many requests",
    data: null,
    error: {
      code: "RATE_LIMITED",
    },
  },
});
