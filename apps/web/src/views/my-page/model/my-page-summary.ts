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

// 역할이 1축이다. 숫자는 그 역할의 진행 중 건수이고, 종료은 보조 줄에서만 센다.
export function summarizeMySessions(sessions: MySessions) {
  const countByChip = (list: SessionCardModel[], chip: SessionChip) =>
    list.filter((card) => card.chip === chip).length;
  const ongoing = (list: SessionCardModel[]) =>
    list.filter((card) => card.chip !== SESSION_CHIP.ended).length;

  const joined = sessions[SESSION_ROLE.player];
  const hosted = sessions[SESSION_ROLE.host];
  const needsConfirm = hosted.filter(
    (card) => card.todo?.kind === SESSION_ACTION_KIND.confirmTime,
  ).length;

  return {
    joined: {
      count: ongoing(joined),
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
      count: ongoing(hosted),
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
