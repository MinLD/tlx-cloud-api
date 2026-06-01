type NodeEnv = "development" | "production" | "test";

interface Env {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
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

export const env: Env = {
  NODE_ENV: toNodeEnv(process.env.NODE_ENV),
  PORT: toNumber(process.env.PORT, 5000),
  DATABASE_URL: toString(
    process.env.DATABASE_URL,
    "postgresql://tlx:tlx@admin.com@localhost:5432/tlx_cloud?schema=public",
  ),
};
