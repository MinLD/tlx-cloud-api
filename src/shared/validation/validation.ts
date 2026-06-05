import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import type { ApiResponse } from "../types/api.type.js";

export type ValidationIssue = {
  path: string;
  message: string;
};

export class ValidationError extends Error {
  constructor(public readonly issues: ValidationIssue[]) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

const toValidationIssues = (error: ZodError): ValidationIssue[] =>
  error.issues.map((issue) => ({
    path: issue.path.join(".") || "body",
    message: issue.message,
  }));

export const validateBody =
  <T extends ZodTypeAny>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new ValidationError(toValidationIssues(result.error)));
    }

    req.body = result.data;
    return next();
  };

export const validateQuery =
  <T extends ZodTypeAny>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(new ValidationError(toValidationIssues(result.error)));
    }

    req.validatedQuery = result.data;
    return next();
  };

export const createValidationResponse = (issues: ValidationIssue[]): ApiResponse<null> => ({
  success: false,
  message: "Validation failed",
  data: null,
  error: issues,
});
