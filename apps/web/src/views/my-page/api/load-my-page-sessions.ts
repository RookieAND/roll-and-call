import { cache } from "react";

import { getGamesByGm, getJoinedGames } from "@/shared/server";

// 요약(세션 수·불참 안내)과 후기 블록(진행한 세션 후기 줄)이 같은 원본을 쓴다.
// react cache는 인자를 Object.is로 비교해서 객체 대신 값 둘을 받는다.
export const loadMyPageSessions = cache(async (serverId: string, userId: string) => {
  const [hosted, joined] = await Promise.all([
    getGamesByGm({ serverId, userId }),
    getJoinedGames({ serverId, userId }),
  ]);
  return { hosted, joined };
});
