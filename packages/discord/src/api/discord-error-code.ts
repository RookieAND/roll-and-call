import { isNumber } from "es-toolkit";

export function discordErrorCode(body: string): number | null {
  return discordErrorField(body, "code");
}

export function discordRetryAfter(body: string): number | null {
  return discordErrorField(body, "retry_after");
}

function discordErrorField(body: string, field: "code" | "retry_after"): number | null {
  try {
    const value = (JSON.parse(body) as Record<string, unknown>)[field];
    return isNumber(value) ? value : null;
  } catch {
    return null;
  }
}
