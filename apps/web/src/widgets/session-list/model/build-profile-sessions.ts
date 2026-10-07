import {
  canViewHiddenGame,
  isSessionEnded,
  PARTICIPANT_STATUS,
  SESSION_ROLE,
  type SessionRole,
} from "@/entities/game";

import { buildSessions } from "./build-sessions";
import type { MySessions, SessionGame } from "./session-card-model";

// 남의 세션 기록. 참여 탭은 확정자로 들어간 구인과 불참으로 내보낸(removed) 끝난 세션이다. 숨긴 구인은 보는 사람이 볼 수 없으면 가린다(R4).
export function buildProfileSessions({
  hosted,
  joined,
  userId,
  viewerId,
  now = new Date(),
}: {
  hosted: SessionGame[];
  joined: SessionGame[];
  userId: string;
  viewerId: string | null;
  now?: Date;
}): MySessions {
  const played = joined.filter((game) =>
    game.participants.some(
      (participant) =>
        participant.userId === userId &&
        (participant.status === PARTICIPANT_STATUS.confirmed ||
          (participant.status === PARTICIPANT_STATUS.removed && isSessionEnded(game, now))),
    ),
  );
  const hiddenIds = new Set(
    [...hosted, ...played]
      .filter((game) => !canViewHiddenGame({ game, viewerId }))
      .map((game) => game.id),
  );

  const sessions = buildSessions({
    hosted,
    joined: played,
    viewerId: userId,
    now,
    readOnly: true,
  });
  // 가린 카드는 제목·일정·GM을 비워 화면 데이터에도 남기지 않는다.
  const marked = (role: SessionRole) =>
    sessions[role].map((card) =>
      hiddenIds.has(card.id) ? { ...card, hidden: true, title: "", schedule: "", gm: null } : card,
    );

  return {
    [SESSION_ROLE.player]: marked(SESSION_ROLE.player),
    [SESSION_ROLE.host]: marked(SESSION_ROLE.host),
  };
}

export const PROFILE_SESSION_SECTIONS = [
  { key: SESSION_ROLE.player, title: "참여", empty: "참여한 세션이 없습니다." },
  { key: SESSION_ROLE.host, title: "운영", empty: "아직 운영한 세션이 없습니다." },
] as const;
