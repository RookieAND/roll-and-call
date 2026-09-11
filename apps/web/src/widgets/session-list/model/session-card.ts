import {
  countConfirmed,
  deriveSessionState,
  isDeadlineUrgent,
  type ParticipantStatus,
  type SessionRole,
  type SessionState,
  splitRoster,
} from "@/entities/game";
import type { Game } from "@/shared/server";
import { formatDateTime, formatMonthDay } from "@/shared/lib";

// 마이페이지·세션 목록 카드의 표시 모델. 도메인 상태(deriveSessionState)를 문구·배지·탭으로 번역한다.
export const HOSTED_TABS = [
  { key: "recruiting", label: "모집 중" },
  { key: "confirmed", label: "확정" },
  { key: "closed", label: "종료" },
] as const;
export const JOINED_TABS = [
  { key: "confirmed", label: "확정" },
  { key: "waiting", label: "대기" },
  { key: "closed", label: "종료" },
] as const;
export type SessionTab = { key: string; label: string };
export type HostedTab = (typeof HOSTED_TABS)[number]["key"];
export type JoinedTab = (typeof JOINED_TABS)[number]["key"];

// 배지는 "언제"만 말한다. target(ISO)은 클라이언트에서 D-N으로 계산.
export type SessionBadgeModel =
  | { kind: "session"; target: string } // 초록 D-N (세션까지)
  | { kind: "deadline"; target: string; urgent: boolean } // 회색/빨강 마감 D-N
  | { kind: "waiting"; label: string } // 대기 N번
  | { kind: "none" }; // 종료: 배지 없음

export type SessionCardModel = {
  id: string;
  title: string;
  round: number;
  role: SessionRole;
  state: SessionState;
  urgent: boolean; // 마감 24h 이내 → 카드 강조
  badge: SessionBadgeModel;
  lead: string | null; // 진행 단계 단어(굵게)
  rest: string; // 서브라인 나머지
  dim: boolean; // 종료 → 지난 날짜 회색
};

type SessionParticipant = {
  userId: string;
  status: ParticipantStatus;
  joinedAt: Date | string;
};

export type SessionGame = Game & {
  gm: { username: string } | null;
  participants: SessionParticipant[];
};

export function toSessionCard({
  game,
  role,
  viewerId,
  now = new Date(),
}: {
  game: SessionGame;
  role: SessionRole;
  viewerId: string;
  now?: Date;
}): SessionCardModel {
  const confirmedCount = countConfirmed(game.participants);
  const state = deriveSessionState(
    {
      confirmedAt: game.confirmedAt,
      endDate: game.endDate,
      maxPlayers: game.maxPlayers,
      confirmedCount,
      scheduleMode: game.scheduleMode,
    },
    now,
  );
  const past = state === "closed" || state === "finished";
  const gmName = game.gm?.username ?? "?";

  const { waiting } = splitRoster(game.participants);
  const myWait =
    role === "player" ? (waiting.find((p) => p.userId === viewerId)?.waitlistRank ?? null) : null;

  const badge = sessionBadge({ game, state, past, myWait, now });
  const urgent = badge.kind === "deadline" && badge.urgent;
  const { lead, rest } = sessionSubline({
    game,
    role,
    state,
    confirmedCount,
    gmName,
  });

  return {
    id: game.id,
    title: game.title,
    round: game.round,
    role,
    state,
    urgent,
    badge,
    lead,
    rest,
    dim: past,
  };
}

function sessionBadge({
  game,
  state,
  past,
  myWait,
  now,
}: {
  game: SessionGame;
  state: SessionState;
  past: boolean;
  myWait: number | null;
  now: Date;
}): SessionBadgeModel {
  if (past) return { kind: "none" };
  if (state === "confirmed" && game.confirmedAt) {
    return { kind: "session", target: new Date(game.confirmedAt).toISOString() };
  }
  // 일정 미정 + 대기자 본인 → 대기 순번을 시간 대신 노출.
  if (myWait != null) return { kind: "waiting", label: `대기 ${myWait}번` };
  return {
    kind: "deadline",
    target: new Date(game.endDate).toISOString(),
    urgent: isDeadlineUrgent(game.endDate, now),
  };
}

function sessionSubline({
  game,
  role,
  state,
  confirmedCount,
  gmName,
}: {
  game: SessionGame;
  role: SessionRole;
  state: SessionState;
  confirmedCount: number;
  gmName: string;
}): { lead: string | null; rest: string } {
  const seats = `${confirmedCount} / ${game.maxPlayers}명`;

  if (role === "host") {
    switch (state) {
      case "recruiting":
        return { lead: "모집 중", rest: seats };
      case "scheduling":
        return { lead: "조율 중", rest: seats };
      case "pending_confirm":
        return {
          lead: "확정 대기",
          rest: `신청 ${game.participants.length}명 · 정원 ${game.maxPlayers}명`,
        };
      case "confirmed":
      case "finished":
        return { lead: null, rest: formatDateTime(game.confirmedAt!) };
      case "closed":
        return { lead: null, rest: `마감 ${formatMonthDay(game.endDate)}` };
    }
  }

  // player: 날짜 자리 + KP 이름
  switch (state) {
    case "confirmed":
    case "finished":
      return { lead: null, rest: `${formatDateTime(game.confirmedAt!)} · KP ${gmName}` };
    case "closed":
      return { lead: null, rest: `마감 ${formatMonthDay(game.endDate)} · KP ${gmName}` };
    default:
      // 일정 미정: 날짜 자리에 "일정 미정".
      return {
        lead: null,
        rest: `일정 미정 · 마감 ${formatMonthDay(game.endDate)} · KP ${gmName}`,
      };
  }
}

function hostedTabOf(state: SessionState): HostedTab {
  if (state === "confirmed") return "confirmed";
  if (state === "closed" || state === "finished") return "closed";
  return "recruiting";
}

function joinedTabOf(state: SessionState): JoinedTab {
  if (state === "confirmed") return "confirmed";
  if (state === "closed" || state === "finished") return "closed";
  return "waiting";
}

// "가까운 순": 예정/모집 탭은 임박 오름차순, 종료 탭은 최근 지난 것부터.
function sortKey(game: SessionGame, tab: string): number {
  if (tab === "confirmed") return new Date(game.confirmedAt!).getTime();
  if (tab === "closed") return new Date(game.confirmedAt ?? game.endDate).getTime();
  return new Date(game.endDate).getTime();
}

function bucketBy<Tab extends string>({
  games,
  role,
  viewerId,
  tabs,
  tabOf,
  now,
}: {
  games: SessionGame[];
  role: SessionRole;
  viewerId: string;
  tabs: readonly { key: Tab }[];
  tabOf: (state: SessionState) => Tab;
  now: Date;
}): Record<Tab, SessionCardModel[]> {
  const rows = new Map<Tab, { card: SessionCardModel; key: number }[]>();
  for (const { key } of tabs) rows.set(key, []);
  for (const game of games) {
    const card = toSessionCard({ game, role, viewerId, now });
    const tab = tabOf(card.state);
    rows.get(tab)!.push({ card, key: sortKey(game, tab) });
  }
  const out = {} as Record<Tab, SessionCardModel[]>;
  for (const { key: tab } of tabs) {
    const list = rows.get(tab)!;
    const descending = tab === "closed";
    list.sort((a, b) => (descending ? b.key - a.key : a.key - b.key));
    out[tab] = list.map((r) => r.card);
  }
  return out;
}

export function bucketHosted(games: SessionGame[], viewerId: string, now: Date = new Date()) {
  return bucketBy({
    games,
    role: "host",
    viewerId,
    tabs: HOSTED_TABS,
    tabOf: hostedTabOf,
    now,
  });
}

export function bucketJoined(games: SessionGame[], viewerId: string, now: Date = new Date()) {
  return bucketBy({
    games,
    role: "player",
    viewerId,
    tabs: JOINED_TABS,
    tabOf: joinedTabOf,
    now,
  });
}
