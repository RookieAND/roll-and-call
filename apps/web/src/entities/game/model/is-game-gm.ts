import { isNull } from "es-toolkit";

import type { Game } from "@/shared/server";
export function isGameGm({ gmId, userId }: { gmId: Game["gmId"]; userId: string | null }): boolean {
  return !isNull(userId) && gmId === userId;
}
