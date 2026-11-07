import "server-only";
import { cache } from "react";

import { listTodos } from "../model/list-todos";
import { loadRejectedRulebooks } from "./load-rejected-rulebooks";
import { loadMySessions } from "./load-sessions";

// react cache는 인자를 Object.is로 비교해서 객체 대신 값 둘을 받는다.
export const loadTodos = cache(async (serverId: string, userId: string) => {
  const [sessions, rejectedRulebooks] = await Promise.all([
    loadMySessions({ serverId, userId }),
    loadRejectedRulebooks({ serverId, userId }),
  ]);
  return listTodos({ sessions, rejectedRulebooks, now: new Date() });
});
