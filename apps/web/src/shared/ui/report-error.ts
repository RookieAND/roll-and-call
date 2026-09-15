import { AppError, UNEXPECTED_ERROR_MESSAGE } from "@/shared/api";

import { toast } from "./toast";

export function reportError(error: unknown, fallbackMessage: string = UNEXPECTED_ERROR_MESSAGE) {
  if (!(error instanceof AppError)) console.error(error);
  toast.error(error instanceof AppError ? error.message : fallbackMessage);
}
