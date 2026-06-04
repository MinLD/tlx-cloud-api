import { describe, expect, test } from "bun:test";
import type { NextFunction, Request, Response } from "express";
import { REQUEST_ID_HEADER, requestIdMiddleware } from "./requestId.middleware.js";

const createMockResponse = () => {
  const headers = new Map<string, string>();

  return {
    headers,
    setHeader(name: string, value: string) {
      headers.set(name, value);
    },
  } as Response & { headers: Map<string, string> };
};

describe("requestIdMiddleware", () => {
  test("reuses incoming request id", () => {
    const req = {
      header(name: string) {
        return name === REQUEST_ID_HEADER ? "req-incoming" : undefined;
      },
    } as unknown as Request;
    const res = createMockResponse();
    let calledNext = false;

    requestIdMiddleware(req, res, (() => {
      calledNext = true;
    }) as NextFunction);

    expect(req.requestId).toBe("req-incoming");
    expect(res.headers.get(REQUEST_ID_HEADER)).toBe("req-incoming");
    expect(calledNext).toBe(true);
  });

  test("generates missing request id", () => {
    const req = {
      header() {
        return undefined;
      },
    } as unknown as Request;
    const res = createMockResponse();

    requestIdMiddleware(req, res, (() => undefined) as NextFunction);

    expect(req.requestId).toBeString();
    expect(res.headers.get(REQUEST_ID_HEADER)).toBe(req.requestId);
  });
});
