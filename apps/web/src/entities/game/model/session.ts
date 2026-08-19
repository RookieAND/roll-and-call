import type { Game } from "@/shared/api/db";
import { formatDateTime, formatMonthDay } from "@/shared/lib/format";
import { countConfirmed, type ParticipantStatus } from "./participant";
import { SCHEDULE_MODE, type ScheduleMode } from "./schedule-mode";
import { splitRoster } from "./split-roster";

// 세션 진행 상태. gameStatus(모집 3분류)보다 세분화된, 마이페이지 표기 전용 모델.
export type SessionState =
  | "recruiting" // 모집 중: 정원 여유
  | "scheduling" // 조율 중: 정원 충족 + coordinate 모드, 시간 미확정
  | "pending_confirm" // 확정 대기: 정원 충족 + fixed 모드, GM 확정 대기
  | "confirmed" // 확정: 세션 시간 확정 + 아직 안 지남
  | "closed" // 종료: 모집 기한 경과 + 확정 없이 무산
  | "finished"; // 종료: 확정 세션이 지남

export type SessionRole = "host" | "player";

export const HOSTED_TABS = ["recruiting", "confirmed", "closed"] as const;
export const JOINED_TABS = ["confirmed", "waiting", "closed"] as const;
export type HostedTab = (typeof HOSTED_TABS)[number];
export type JoinedTab = (typeof JOINED_TABS)[number];

const URGENT_MS = 24 * 60 * 60 * 1000;

// confirmedAt(세션 시간)이 정원/기한보다 우선. 확정된 세션은 지났으면 finished.
// ponytail: 정원 충족 후 scheduling/pending_confirm 은 scheduleMode로 근사한다
// (조율 진행률 availabilities 를 조회하지 않는 휴리스틱). 세밀화가 필요하면 그때 쿼리 추가.
export function deriveSessionState(
  {
    confirmedAt,
    endDate,
    maxPlayers,
    confirmedCount,
    scheduleMode,
  }: {
    confirmedAt: Game["confirmedAt"];
    endDate: Game["endDate"];
    maxPlayers: number;
    confirmedCount: number;
    scheduleMode: ScheduleMode;
  },
  now: Date = new Date(),
): SessionState {
  const t = now.getTime();
  if (confirmedAt) {
    return new Date(confirmedAt).getTime() < t ? "finished" : "confirmed";
  }
  if (new Date(endDate).getTime() < t) return "closed";
  if (confirmedCount < maxPlayers) return "recruiting";
  return scheduleMode === SCHEDULE_MODE.coordinate ? "scheduling" : "pending_confirm";
}

// 사용자 타임존(로컬) 기준 남은 "날짜 수". 오늘=0, 3일 뒤=3. 클라이언트에서만 호출.
export function dday(target: Date | string, now: Date = new Date()): number {
  const t = new Date(target);
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

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
  href: string;
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
    href: role === "host" && !past ? `/games/${game.id}/participants` : `/games/${game.id}`,
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
  const end = new Date(game.endDate).getTime();
  const urgent = end > now.getTime() && end - now.getTime() < URGENT_MS;
  return { kind: "deadline", target: new Date(game.endDate).toISOString(), urgent };
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
  tabs: readonly Tab[];
  tabOf: (state: SessionState) => Tab;
  now: Date;
}): Record<Tab, SessionCardModel[]> {
  const rows = new Map<Tab, { card: SessionCardModel; key: number }[]>();
  for (const tab of tabs) rows.set(tab, []);
  for (const game of games) {
    const card = toSessionCard({ game, role, viewerId, now });
    const tab = tabOf(card.state);
    rows.get(tab)!.push({ card, key: sortKey(game, tab) });
  }
  const out = {} as Record<Tab, SessionCardModel[]>;
  for (const tab of tabs) {
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
