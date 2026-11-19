import type { Game } from "@roll-and-call/database";

import type { ScheduleConflictRejection } from "@/entities/game";
import type { ActionResult } from "@/shared/api";

export type RoundScheduleResult = ActionResult & {
  conflict?: ScheduleConflictRejection;
  notificationIds?: string[];
  previous?: { roundNo: number; startsAt: string; endsAt: string }[];
  repeatRule?: Game["repeatRule"];
};
