import { toast } from "@roll-and-call/ui";

import { AppError, UNEXPECTED_ERROR_MESSAGE } from "@/shared/api";

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
