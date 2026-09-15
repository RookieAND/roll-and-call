import {
  type MySessions,
  type SessionCardModel,
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  type SessionChip,
} from "@/widgets/session-list";

import { joinCountParts } from "./join-count-parts";

export function summarizeMySessions(sessions: MySessions) {
  const countByChip = (list: SessionCardModel[], chip: SessionChip) =>
    list.filter((card) => card.chip === chip).length;
  const needsConfirm = sessions.hosted.filter(
    (card) => card.action?.kind === SESSION_ACTION_KIND.confirmTime,
  ).length;
  const total = sessions.joined.length + sessions.hosted.length + sessions.past.length;

  return {
    joined: {
      count: sessions.joined.length,
      detail:
        joinCountParts([
          ["확정", countByChip(sessions.joined, SESSION_CHIP.confirmed)],
          ["조율 중", countByChip(sessions.joined, SESSION_CHIP.scheduling)],
          ["대기", countByChip(sessions.joined, SESSION_CHIP.waiting)],
        ]) ?? (sessions.joined.length === 0 ? "신청한 구인이 없습니다" : null),
      href: "/me/sessions",
    },
    hosting: {
      count: sessions.hosted.length,
      urgent: needsConfirm > 0,
      detail:
        needsConfirm > 0
          ? `확정 필요 ${needsConfirm}`
          : (joinCountParts([
              ["모집 중", countByChip(sessions.hosted, SESSION_CHIP.recruiting)],
              ["확정", countByChip(sessions.hosted, SESSION_CHIP.confirmed)],
            ]) ?? (sessions.hosted.length === 0 ? "아직 구인을 열지 않았습니다" : null)),
      href: "/me/sessions?tab=hosted",
    },
    past: {
      count: sessions.past.length,
      href: "/me/sessions?tab=past",
    },
    isEmpty: total === 0,
  };
}
