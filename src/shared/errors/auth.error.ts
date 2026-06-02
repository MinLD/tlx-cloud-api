export type AuthErrorCode =
  | "USER_ALREADY_EXISTS"
  | "INVALID_EMAIL"
  | "INVALID_PASSWORD";

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AuthError";
  }
}