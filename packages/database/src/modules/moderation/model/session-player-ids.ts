import { isNil } from "es-toolkit";

import { isRecognizedPost } from "#db/modules/games/model";

export interface PlayerCountSession {
  memberIds: readonly string[];
  hidden?: unknown;
  cancelled?: boolean;
  endsAt?: Date | null;
  roundCount?: number;
  finishedAt?: Date | null;
  // 다회차에서 완주한 사람. 다회차는 이 사람들만 참여 세션으로 센다.
  finisherIds?: readonly string[];
}

// 참여 세션으로 셀 사람들. 단발은 끝난 인정 세션의 확정자, 다회차는 구인이 끝났을 때의 완주자만이다.
export function sessionPlayerIds(session: PlayerCountSession, now: Date): readonly string[] {
  if ((session.roundCount ?? 1) <= 1)
    return isRecognizedPost(session, now) ? session.memberIds : [];
  const finished = !isNil(session.finishedAt) && session.finishedAt.getTime() <= now.getTime();
  if (!finished || session.cancelled || !isNil(session.hidden)) return [];
  return session.finisherIds ?? [];
}
