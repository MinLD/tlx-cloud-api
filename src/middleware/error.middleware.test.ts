import { describe, expect, test } from "bun:test";
import type { NextFunction, Request, Response } from "express";
import { registerBodySchema } from "../modules/auth/auth.schema.js";
import { HttpError } from "../shared/errors/http.error.js";
import { validateBody } from "../shared/validation/validation.js";
import { errorHandler } from "./error.middleware.js";

type MockResponse = Response & {
  body?: unknown;
  statusCode?: number;
};

const createMockResponse = (): MockResponse => {
  const response = {
    body: undefined as unknown,
    statusCode: undefined as number | undefined,
    status(statusCode: number) {
      this.statusCode = statusCode;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
  };

  return response as MockResponse;
};

describe("errorHandler", () => {
  test("returns HttpError status", () => {
    const req = { requestId: "req_1" } as Request;
    const res = createMockResponse();

    errorHandler(
      new HttpError(403, "FORBIDDEN", "No access"),
      req,
      res,
      (() => undefined) as NextFunction,
    );

    expect(res.statusCode).toBe(403);
    expect(res.body).toMatchObject({
      success: false,
      message: "No access",
      error: {
        code: "FORBIDDEN",
        requestId: "req_1",
      },
    });
  });

  test("returns 400 for ValidationError", () => {
    const req = {
      body: {
        name: "T",
        email: "bad-email",
        password: "123",
      },
      requestId: "req_2",
    } as Request;
    let nextError: unknown;

    validateBody(registerBodySchema)(req, {} as Response, ((error?: unknown) => {
      nextError = error;
    }) as NextFunction);

    const res = createMockResponse();
    errorHandler(nextError, req, res, (() => undefined) as NextFunction);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: "Validation failed",
      error: {
        requestId: "req_2",
      },
    });
  });
});
