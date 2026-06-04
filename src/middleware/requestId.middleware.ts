import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

export const REQUEST_ID_HEADER = "x-request-id";

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incomingRequestId = req.header(REQUEST_ID_HEADER)?.trim();
  const requestId = incomingRequestId || randomUUID();

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  return next();
};
