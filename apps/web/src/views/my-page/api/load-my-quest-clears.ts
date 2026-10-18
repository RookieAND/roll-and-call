import { getQuestClears } from "@roll-and-call/database/onboarding";
import { cache } from "react";

import { getCurrentServer } from "@/shared/server";

// 설정 줄이 모바일 본문과 데스크톱 패널 두 곳에 그려져 한 요청에서 한 번만 읽도록 묶는다.
export const loadMyQuestClears = cache(async (userId: string) => {
  const server = await getCurrentServer();
  return getQuestClears({ serverId: server.id, userId });
});
