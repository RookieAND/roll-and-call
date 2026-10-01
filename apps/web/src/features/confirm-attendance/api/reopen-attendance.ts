"use server";

import { setAttendanceConfirmedAt } from "@roll-and-call/database/web";

import type { ActionResult } from "@/shared/api";
import { getCurrentServer } from "@/shared/server";

import { guardAttendance } from "./guard-attendance";

export async function reopenAttendance(gameId: string): Promise<ActionResult> {
  const serverId = (await getCurrentServer()).id;
  return guardAttendance({
    gameId,
    work: (transaction) =>
      setAttendanceConfirmedAt({ transaction, serverId, gameId, attendanceConfirmedAt: null }),
  });
}
