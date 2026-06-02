import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { router as userRouter } from "./routes/user.route.js";
import { router as authRouter } from "./routes/auth.route.js";
import type { ApiResponse } from "./shared/types/api.type.js";

export function createServer() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/", (_req: Request, res: Response) => {
    res.json({
      name: "TLX Cloud API",
      status: "ok",
      version: "0.1.0",
    });
  });

  app.use("/users", userRouter);
  app.use("/auth", authRouter);

  app.use((_req: Request, res: Response<ApiResponse<null>>) => {
    return res.status(404).json({
      success: false,
      message: "Route not found",
      data: null,
      error: {
        path: _req.originalUrl,
      },
    });
  });

  app.use(
    (err: unknown, _req: Request, res: Response<ApiResponse<null>>, _next: NextFunction) => {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: null,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    },
  );

  return app;
}
