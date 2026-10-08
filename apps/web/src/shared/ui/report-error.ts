import { AppError, UNEXPECTED_ERROR_MESSAGE } from "@/shared/api";

import { toast } from "./toast";

export function reportError({
  error,
  fallbackMessage = UNEXPECTED_ERROR_MESSAGE,
}: {
  error: unknown;
  fallbackMessage?: string;
}) {
  if (!(error instanceof AppError)) console.error(error);
  toast.danger(error instanceof AppError ? error.message : fallbackMessage);
}
