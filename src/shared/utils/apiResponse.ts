import type { Response } from "express";
import type { ApiResponse } from "../types/api.type.js";

export const sendApiResponse = <T>(
  res: Response<ApiResponse<T>>,
  statusCode: number,
  message: string,
  data?: T
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendApiError = (
  res: Response<ApiResponse<null>>,
  statusCode: number,
  message: string,
  error?: unknown
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
    data: null
  });
};
