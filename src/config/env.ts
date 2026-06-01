type NodeEnv = "development" | "production" | "test";

interface Env {
  NODE_ENV: NodeEnv;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
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
  PORT: toNumber(process.env.PORT, 3001),
  DB_HOST: toString(process.env.DB_HOST, "localhost"),
  DB_PORT: toNumber(process.env.DB_PORT, 5432),
  DB_USER: toString(process.env.DB_USER, "tlx"),
  DB_PASSWORD: toString(process.env.DB_PASSWORD, "tlx@admin.com"),
  DB_NAME: toString(process.env.DB_NAME, "tlx_cloud"),
};
