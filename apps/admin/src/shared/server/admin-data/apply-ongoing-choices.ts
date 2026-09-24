import "server-only";
import { games, participants } from "@roll-and-call/database";
import { and, eq, gt, sql } from "drizzle-orm";

import type { Executor } from "./record-audit";

export interface OngoingChoice {
  sessionId: string;
  action: "keep" | "leave" | "close";
}

// "참여 빼기"는 명단에서 빼고, "구인 닫기"는 모집 마감일을 지금으로 당긴다. 닫힌 구인 참여자 수를 돌려준다.
// ponytail: 빠진 자리에 대기자를 올리지 않는다. 사용자 앱의 승계 규칙을 어드민에 옮길 때 붙인다.
export async function applyOngoingChoices(tx: Executor, userId: string, choices: OngoingChoice[]) {
  let notifiedMembers = 0;
  for (const choice of choices) {
    if (choice.action === "leave") {
      await tx
        .delete(participants)
        .where(and(eq(participants.gameId, choice.sessionId), eq(participants.userId, userId)));
    }
    if (choice.action === "close") {
      const closed = await tx
        .update(games)
        .set({ endDate: sql`now()` })
        .where(
          and(
            eq(games.id, choice.sessionId),
            eq(games.gmId, userId),
            gt(games.endDate, sql`now()`),
          ),
        )
        .returning({ id: games.id });
      if (closed.length === 0) continue;
      notifiedMembers += await tx.$count(participants, eq(participants.gameId, choice.sessionId));
    }
  }
  return notifiedMembers;
}
