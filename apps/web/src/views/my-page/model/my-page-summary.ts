import { SESSION_ROLE } from "@/entities/game";
import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  type MySessions,
  type SessionCardModel,
  sessionsHref,
  type SessionChip,
} from "@/widgets/session-list";

import { joinCountParts } from "./join-count-parts";

// 역할이 1축이다. 숫자는 마감·종료까지 더한 그 역할의 총 건수이고, 내역은 보조 줄이 말한다.
export function summarizeMySessions(sessions: MySessions) {
  const countByChip = (list: SessionCardModel[], chip: SessionChip) =>
    list.filter((card) => card.chip === chip).length;

  const joined = sessions[SESSION_ROLE.player];
  const hosted = sessions[SESSION_ROLE.host];
  const needsConfirm = hosted.filter(
    (card) => card.todo?.kind === SESSION_ACTION_KIND.confirmTime,
  ).length;

  return {
    joined: {
      count: joined.length,
      detail:
        joinCountParts([
          ["확정", countByChip(joined, SESSION_CHIP.confirmed)],
          ["조율 중", countByChip(joined, SESSION_CHIP.scheduling)],
          ["대기", countByChip(joined, SESSION_CHIP.waiting)],
          ["종료", countByChip(joined, SESSION_CHIP.ended)],
        ]) ?? "신청한 구인이 없습니다",
      href: sessionsHref(SESSION_ROLE.player),
    },
    hosting: {
      count: hosted.length,
      urgent: needsConfirm > 0,
      detail:
        joinCountParts([
          ["확정 필요", needsConfirm],
          ["모집 중", countByChip(hosted, SESSION_CHIP.recruiting) - needsConfirm],
          ["확정", countByChip(hosted, SESSION_CHIP.confirmed)],
          ["종료", countByChip(hosted, SESSION_CHIP.ended)],
        ]) ?? "아직 구인을 열지 않았습니다",
      href: sessionsHref(SESSION_ROLE.host),
    },
    isEmpty: joined.length + hosted.length === 0,
  };
}
