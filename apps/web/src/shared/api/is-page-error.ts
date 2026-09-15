import { AppError } from "./app-error";
import { ERROR_DISPLAY } from "./error-display";

export function isPageError(error: unknown): boolean {
  return error instanceof AppError && error.display === ERROR_DISPLAY.page;
}
