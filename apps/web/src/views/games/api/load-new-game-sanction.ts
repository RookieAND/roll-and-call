import { cache } from "react";

import { findActiveSanction, getCurrentMembership, getCurrentServer } from "@/shared/server";

// 앱바 [+ 새 구인]과 빈 상태 [새 구인 등록]이 같은 요청에서 한 번만 읽는다. 비멤버는 제재를 읽지 않는다.
export const loadNewGameSanction = cache(async () => {
  const [server, membership] = await Promise.all([getCurrentServer(), getCurrentMembership()]);
  if (!membership) return null;
  return findActiveSanction({ serverId: server.id, userId: membership.userId });
});
