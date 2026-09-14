import type { MySessions, SessionCardModel, SessionChip } from "@/widgets/session-list";

// 마이페이지 "내 세션" 세 행(참여 중 · 내가 운영 · 끝난 세션)의 숫자와 보조 줄.
// 숫자는 이 화면 한 곳에서만 센다. 보조 줄은 0인 항목을 뺀 내역이고, 각 행은 내 세션의 해당 탭으로 간다.
export function summarizeMySessions(sessions: MySessions) {
  const count = (list: SessionCardModel[], chip: SessionChip) =>
    list.filter((c) => c.chip === chip).length;
  const needsConfirm = sessions.hosted.filter((c) => c.action?.kind === "confirm-time").length;
  const total = sessions.joined.length + sessions.hosted.length + sessions.past.length;

  return {
    joined: {
      count: sessions.joined.length,
      detail: detail([
        ["확정", count(sessions.joined, "confirmed")],
        ["조율 중", count(sessions.joined, "scheduling")],
        ["대기", count(sessions.joined, "waiting")],
      ]),
      href: "/me/sessions",
    },
    hosting: {
      count: sessions.hosted.length,
      // 확정 필요가 있으면 그것만 경고색으로 말한다.
      urgent: needsConfirm > 0,
      detail:
        needsConfirm > 0
          ? `확정 필요 ${needsConfirm}`
          : detail([
              ["모집 중", count(sessions.hosted, "recruiting")],
              ["확정", count(sessions.hosted, "confirmed")],
            ]),
      href: "/me/sessions?tab=hosted",
    },
    past: {
      count: sessions.past.length,
      href: "/me/sessions?tab=past",
    },
    isEmpty: total === 0,
  };
}

function detail(parts: [string, number][]): string | null {
  const text = parts
    .filter(([, n]) => n > 0)
    .map(([label, n]) => `${label} ${n}`)
    .join(" · ");
  return text || null;
}
