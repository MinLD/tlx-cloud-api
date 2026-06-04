import "dotenv/config";

type NodeEnv = "development" | "production" | "test";

interface Env {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGINS: string[];
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
}

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toNodeEnv = (value: string | undefined): NodeEnv => {
  if (value === "production" || value === "test") {
    return value;
  }

  return "development";
};

const toString = (value: string | undefined, fallback: string): string => {
  return value?.trim() || fallback;
};

const toStringList = (value: string | undefined): string[] => {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
};

export const env: Env = {
  NODE_ENV: toNodeEnv(process.env.NODE_ENV),
  PORT: toNumber(process.env.PORT, 5000),
  JWT_SECRET: toString(process.env.JWT_SECRET, ""),
  DATABASE_URL: toString(process.env.DATABASE_URL, ""),
  JWT_EXPIRES_IN: toString(process.env.JWT_EXPIRES_IN, ""),
  CORS_ORIGINS: toStringList(process.env.CORS_ORIGINS),
  RATE_LIMIT_WINDOW_MS: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  RATE_LIMIT_MAX: toNumber(process.env.RATE_LIMIT_MAX, 100),
};
