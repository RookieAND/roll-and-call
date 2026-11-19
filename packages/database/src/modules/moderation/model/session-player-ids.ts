import { isNil } from "es-toolkit";

import { isRecognizedPost } from "#db/modules/games/model";

export interface PlayerCountSession {
  memberIds: readonly string[];
  hidden?: unknown;
  cancelled?: boolean;
  endsAt?: Date | null;
  roundCount?: number;
  // 다회차에서 출석을 확정한 회차와 그 회차에 참석한 사람. 다회차는 참석한 회차마다 참여 세션 하나다.
  confirmedRounds?: readonly { endsAt: Date | null; attendeeIds: readonly string[] }[];
}

// 참여 세션으로 셀 사람들. 단발은 끝난 인정 세션의 확정자, 다회차는 끝난 회차의 참석자(회차마다 한 번씩 담는다)다.
export function sessionPlayerIds(session: PlayerCountSession, now: Date): readonly string[] {
  if ((session.roundCount ?? 1) <= 1)
    return isRecognizedPost(session, now) ? session.memberIds : [];
  if (session.cancelled || !isNil(session.hidden)) return [];
  return (session.confirmedRounds ?? [])
    .filter((round) => !isNil(round.endsAt) && round.endsAt.getTime() <= now.getTime())
    .flatMap((round) => round.attendeeIds);
}
