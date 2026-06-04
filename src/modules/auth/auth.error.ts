import { HttpError, type HttpErrorCode } from "../../shared/errors/http.error.js";

export type AuthErrorCode =
  | "USER_ALREADY_EXISTS"
  | "INVALID_EMAIL"
  | "INVALID_PASSWORD"
  | "INVALID_TOKEN"
  | "USER_NOT_FOUND";

const authErrorMap: Record<
  AuthErrorCode,
  { statusCode: number; code: HttpErrorCode; message: string }
> = {
  USER_ALREADY_EXISTS: {
    statusCode: 409,
    code: "CONFLICT",
    message: "User already exists with this email",
  },
  INVALID_EMAIL: {
    statusCode: 401,
    code: "UNAUTHORIZED",
    message: "Invalid email",
  },
  INVALID_PASSWORD: {
    statusCode: 401,
    code: "UNAUTHORIZED",
    message: "Invalid password",
  },
  INVALID_TOKEN: {
    statusCode: 401,
    code: "UNAUTHORIZED",
    message: "Unauthorized: token failed",
  },
  USER_NOT_FOUND: {
    statusCode: 401,
    code: "UNAUTHORIZED",
    message: "User no longer exists",
  },
};

export class AuthError extends HttpError {
  constructor(public readonly authCode: AuthErrorCode) {
    const error = authErrorMap[authCode];
    super(error.statusCode, error.code, error.message, { authCode });
    this.name = "AuthError";
  }
}
