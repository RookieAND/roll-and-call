import { and, eq, isNotNull, or } from "drizzle-orm";

import { participants } from "../schema";

// countsAsAttended와 같은 조건을 SQL로.
export const attendedWhere = and(
  eq(participants.status, "confirmed"),
  or(eq(participants.absent, false), isNotNull(participants.absenceCancelledAt)),
)!;
