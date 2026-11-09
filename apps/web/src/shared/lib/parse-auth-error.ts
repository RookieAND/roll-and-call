import { AUTH_ERROR, type AuthError } from "./auth-error";

export function parseAuthError(value: unknown): AuthError | null {
  return Object.values(AUTH_ERROR).find((error) => error === value) ?? null;
}
