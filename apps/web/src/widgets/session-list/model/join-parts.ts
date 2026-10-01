import { compact } from "es-toolkit";
export function joinParts(...parts: (string | null | false)[]): string {
  return compact(parts).join(" · ");
}
