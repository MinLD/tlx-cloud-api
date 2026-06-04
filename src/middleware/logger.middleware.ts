import morgan from "morgan";
import { env } from "../config/env.js";

export const loggerMiddleware = morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
  skip: () => env.NODE_ENV === "test",
});
