import { PARTICIPANT_STATUS, SESSION_ROLE } from "@/entities/game";

import { buildSessions } from "./build-sessions";
import type { MySessions, SessionGame } from "./session-card-model";

// 남의 프로필: 운영은 여는 구인 전부, 참여는 확정된 것만. 대기 중인 신청은 쓰지 않는다.
export function buildProfileSessions({
  hosted,
  joined,
  userId,
  now = new Date(),
}: {
  hosted: SessionGame[];
  joined: SessionGame[];
  userId: string;
  now?: Date;
}): MySessions {
  const confirmed = joined.filter((game) =>
    game.participants.some(
      (participant) =>
        participant.userId === userId && participant.status === PARTICIPANT_STATUS.confirmed,
    ),
  );

  return buildSessions({
    hosted,
    joined: confirmed,
    viewerId: userId,
    respondedGameIds: new Set(),
    responseCounts: new Map(),
    now,
    readOnly: true,
  });
}

export const PROFILE_SESSION_SECTIONS = [
  { key: SESSION_ROLE.host, title: "운영", empty: "아직 운영한 세션이 없습니다." },
  { key: SESSION_ROLE.player, title: "참여", empty: "참여한 세션이 없습니다." },
] as const;
