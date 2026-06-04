import type { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "../shared/errors/http.error.js";
import type { ApiResponse } from "../shared/types/api.type.js";
import { ValidationError } from "../shared/validation/validation.js";

export const notFoundHandler: RequestHandler<unknown, ApiResponse<null>> = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
    error: {
      path: req.originalUrl,
      requestId: req.requestId,
    },
  });
};

export const errorHandler: ErrorRequestHandler<unknown, ApiResponse<null>> = (
  err,
  req,
  res,
  _next,
) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      data: null,
      error: {
        issues: err.issues,
        requestId: req.requestId,
      },
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
      error: {
        code: err.code,
        details: err.details,
        requestId: req.requestId,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: null,
    error: {
      message: err instanceof Error ? err.message : "Unknown error",
      requestId: req.requestId,
    },
  });
};
