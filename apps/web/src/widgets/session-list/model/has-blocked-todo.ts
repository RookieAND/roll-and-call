import type { SessionGame } from "@/entities/game";

import { buildSessions } from "./build-sessions";

// 막힌 할 일은 GM 카드에서만 나온다(참여 카드의 할 일은 늘 막히지 않는다). 응답 수는 할 일 문구에만 쓰여 비워 둔다.
export function hasBlockedTodo({
  hosted,
  viewerId,
  now,
}: {
  hosted: SessionGame[];
  viewerId: string;
  now?: Date;
}): boolean {
  const sessions = buildSessions({
    hosted,
    joined: [],
    viewerId,
    respondedGameIds: new Set(),
    responseCounts: new Map(),
    now,
  });
  return sessions.host.some((card) => card.todo?.blocked);
}
