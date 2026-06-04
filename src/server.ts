import cookieParser from "cookie-parser";
import express, { type Request, type Response } from "express";
import { env } from "./config/env.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware.js";
import { requestIdMiddleware } from "./middleware/requestId.middleware.js";
import { securityMiddleware } from "./middleware/security.middleware.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { userRouter } from "./modules/users/user.route.js";

export function createServer() {
  const app = express();

  app.disable("x-powered-by");
  app.use(requestIdMiddleware);
  app.use(securityMiddleware);
  app.use(corsMiddleware);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(rateLimitMiddleware);
  app.use(loggerMiddleware);

  app.get("/", (_req: Request, res: Response) => {
    res.json({
      name: "TLX Cloud API",
      status: "ok",
      version: "0.1.0",
    });
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
