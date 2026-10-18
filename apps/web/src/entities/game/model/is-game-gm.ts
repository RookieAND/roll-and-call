import type { Game } from "@roll-and-call/database";
import { isNull } from "es-toolkit";
export function isGameGm({ gmId, userId }: { gmId: Game["gmId"]; userId: string | null }): boolean {
  return !isNull(userId) && gmId === userId;
}
