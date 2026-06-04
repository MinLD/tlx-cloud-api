import { describe, expect, test } from "bun:test";
import type { NextFunction, Request, Response } from "express";
import { registerBodySchema } from "../../modules/auth/auth.schema.js";
import { validateBody, ValidationError } from "./validation.js";

describe("validateBody", () => {
  test("passes parsed data to req.body", () => {
    const req = {
      body: {
        name: "  Taylor  ",
        email: "taylor@example.com",
        password: "secret123",
      },
    } as Request;
    let nextError: unknown;

    validateBody(registerBodySchema)(req, {} as Response, ((error?: unknown) => {
      nextError = error;
    }) as NextFunction);

    expect(nextError).toBeUndefined();
    expect(req.body.name).toBe("Taylor");
  });

  test("passes ValidationError to next on invalid body", () => {
    const req = {
      body: {
        name: "T",
        email: "bad-email",
        password: "123",
      },
    } as Request;
    let nextError: unknown;

    validateBody(registerBodySchema)(req, {} as Response, ((error?: unknown) => {
      nextError = error;
    }) as NextFunction);

    expect(nextError).toBeInstanceOf(ValidationError);
  });
});
