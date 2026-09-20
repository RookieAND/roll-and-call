"use server";

import { eq } from "drizzle-orm";

import type { ActionResult } from "@/shared/api";
import { games } from "@/shared/server";

import { guardAttendance } from "./guard-attendance";

// 잘못 정했을 때 다시 고르게 연다. 참석 여부 값은 그대로 두고 확정만 푼다.
export async function reopenAttendance(gameId: string): Promise<ActionResult> {
  return guardAttendance(gameId, async (transaction) => {
    await transaction
      .update(games)
      .set({ attendanceConfirmedAt: null })
      .where(eq(games.id, gameId));
  });
}
