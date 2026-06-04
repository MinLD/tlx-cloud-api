import cors from "cors";
import { env } from "../config/env.js";

const isDevelopment = env.NODE_ENV === "development";

export const corsMiddleware = cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (isDevelopment || env.CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
});
