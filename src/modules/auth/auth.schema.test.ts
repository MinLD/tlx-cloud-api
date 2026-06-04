import { describe, expect, test } from "bun:test";
import { loginBodySchema, registerBodySchema } from "./auth.schema.js";

describe("auth schemas", () => {
  test("validates register body", () => {
    const result = registerBodySchema.safeParse({
      name: "Taylor",
      email: "taylor@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(true);
  });

  test("rejects invalid register body", () => {
    const result = registerBodySchema.safeParse({
      name: "T",
      email: "bad-email",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  test("validates login body", () => {
    const result = loginBodySchema.safeParse({
      email: "taylor@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(true);
  });

  test("rejects empty login password", () => {
    const result = loginBodySchema.safeParse({
      email: "taylor@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});
