import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { router as userRouter } from "./routes/user.route.js";

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

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      message: "Route not found",
      path: _req.originalUrl,
    });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  });

  return app;
}
