import "server-only";
import { cache } from "react";

import { loadMySessions } from "./load-sessions";

// 내비 점은 막힌 할 일이 있는지만 알면 된다. 룰북 인증 할 일은 막지 않으므로 룰북 기록 조회를 건너뛴다.
export const loadBlockedTodo = cache(async (serverId: string, userId: string) => {
  const sessions = await loadMySessions({ serverId, userId });
  return [...sessions.host, ...sessions.player].some((card) => card.todo?.blocked);
});
