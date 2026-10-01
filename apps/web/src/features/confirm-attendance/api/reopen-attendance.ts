"use server";

import { eq } from "drizzle-orm";

import type { ActionResult } from "@/shared/api";
import { games } from "@/shared/server";

import { guardAttendance } from "./guard-attendance";

export async function reopenAttendance(gameId: string): Promise<ActionResult> {
  return guardAttendance({
    gameId,
    work: async (transaction) => {
      await transaction
        .update(games)
        .set({ attendanceConfirmedAt: null })
        .where(eq(games.id, gameId));
    },
  });
}
