import "server-only";
import { isNotNil, minBy } from "es-toolkit";

import { SESSION_CHIP } from "../model/session-card-model";
import { loadMySessions } from "./load-sessions";

// 인덱스 서버 카드의 "할 일 N건"과 "다음 내 세션". 홈·마이와 같은 세션 카드에서 센다.
export async function loadServerSummary({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const { host, player } = await loadMySessions({ serverId, userId });
  const sessions = [...host, ...player];
  const now = Date.now();
  const upcoming = sessions
    .filter((session) => session.chip === SESSION_CHIP.confirmed && isNotNil(session.startsAt))
    .map((session) => new Date(session.startsAt!))
    .filter((startsAt) => startsAt.getTime() > now);
  return {
    todoCount: sessions.filter((session) => isNotNil(session.todo)).length,
    nextSessionAt: minBy(upcoming, (startsAt) => startsAt.getTime()) ?? null,
  };
}
