import { isNumber } from "es-toolkit";

export function discordErrorCode(body: string): number | null {
  try {
    const { code } = JSON.parse(body) as { code?: unknown };
    return isNumber(code) ? code : null;
  } catch {
    return null;
  }
}
