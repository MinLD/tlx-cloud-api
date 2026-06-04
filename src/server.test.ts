import { describe, expect, test } from "bun:test";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://tlx:tlx@localhost:5432/tlx_cloud";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";

type RouterLayer = {
  name: string;
  path?: string;
  match(path: string): boolean;
  handle: {
    stack?: Array<{
      route?: {
        path: string;
        methods: Record<string, boolean>;
      };
    }>;
  };
};

const getRouterLayer = async (path: string): Promise<RouterLayer | undefined> => {
  const { createServer } = await import("./server.js");
  const app = createServer();
  const stack = (app.router?.stack ?? []) as unknown as RouterLayer[];

  return stack.find((layer) => layer.name === "router" && layer.match(path));
};

const getMiddlewareNames = async (): Promise<string[]> => {
  const { createServer } = await import("./server.js");
  const app = createServer();
  const stack = (app.router?.stack ?? []) as Array<{ name: string }>;

  return stack.map((layer) => layer.name);
};

describe("server routes", () => {
  test("mounts auth routes under /api/v1", async () => {
    const layer = await getRouterLayer("/api/v1/auth/logout");
    const route = layer?.handle.stack?.find((item) => item.route?.path === "/logout")?.route;

    expect(layer?.path).toBe("/api/v1/auth");
    expect(route?.methods.post).toBe(true);
  });

  test("mounts users routes under /api/v1", async () => {
    const layer = await getRouterLayer("/api/v1/users");
    const route = layer?.handle.stack?.find((item) => item.route?.path === "/")?.route;

    expect(layer?.path).toBe("/api/v1/users");
    expect(route?.methods.get).toBe(true);
  });

  test("does not mount old auth route", async () => {
    const layer = await getRouterLayer("/auth/logout");

    expect(layer).toBeUndefined();
  });

  test("registers cross-cutting middleware before routes", async () => {
    const names = await getMiddlewareNames();

    expect(names.slice(0, 6)).toEqual([
      "requestIdMiddleware",
      "helmetMiddleware",
      "corsMiddleware",
      "jsonParser",
      "urlencodedParser",
      "cookieParser",
    ]);
    expect(names).toContain("logger");
    expect(names.at(-2)).toBe("notFoundHandler");
    expect(names.at(-1)).toBe("errorHandler");
  });
});
