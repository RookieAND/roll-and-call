import "server-only";
import { getGamesByGm } from "@roll-and-call/database/games";
import { cache } from "react";

import { hasBlockedTodo } from "../model/has-blocked-todo";

// 내비 점은 막힌 할 일이 있는지만 알면 된다. 막힌 할 일은 GM이 연 구인에서만 생기므로 참여·응답·후기 조회를 건너뛴다.
export const loadBlockedTodo = cache(async (serverId: string, userId: string) =>
  hasBlockedTodo({ hosted: await getGamesByGm({ serverId, userId }), viewerId: userId }),
);
