import {
  countConfirmed,
  deriveGameStatus,
  deriveSessionState,
  gameStatusColor,
  gameStatusLabel,
  isDeadlineUrgent,
  type ParticipantStatus,
  SCHEDULE_MODE,
  scheduleLine,
  type SessionRole,
  splitRoster,
} from "@/entities/game";
import { ddayKst, formatDate, formatDateTime } from "@/shared/lib";
import type { Game } from "@/shared/server";

// 홈·내 세션·마이페이지가 같은 카드 모델을 쓴다. 도메인 상태를 탭·칩·배지·일정 한 줄·할 일로 번역한다.
// 배지는 모집·참여 상태만, D-n은 일정 줄에. 역할이 달라도 같은 사실은 같은 자리에서 읽힌다.

export type SessionBucket = "joined" | "hosted" | "past";
export type SessionChip = "scheduling" | "confirmed" | "waiting" | "recruiting";
export type SessionTone = "normal" | "success" | "warning" | "hint";
export type SessionAction = {
  kind: "confirm-time" | "submit-availability";
  label: string;
  href: string;
};

export type SessionCardModel = {
  id: string;
  title: string;
  round: number;
  role: SessionRole;
  bucket: SessionBucket;
  chip: SessionChip | null;
  badge: string;
  badgeColor: "primary" | "success" | "gray";
  schedule: string;
  scheduleTone: SessionTone;
  meta: string;
  // 마감 24시간 이내 → 카드 강조
  urgent: boolean;
  // 지금 할 일이 있을 때만. 홈 할 일 카드와 같은 라벨.
  action: SessionAction | null;
  // 세션 시각이 정해졌으면 그 시각(ISO)
  startsAt: string | null;
  // 가까운 것부터(끝남은 최근 것부터) 정렬할 키
  sortKey: number;
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

export type SessionContext = {
  viewerId: string;
  // 뷰어가 가능 시간을 낸 게임
  respondedGameIds: ReadonlySet<string>;
  // 게임별 가능 시간을 낸 확정 참여자 수
  responseCounts: ReadonlyMap<string, number>;
  now?: Date;
};

// 세션까지 남은 날: 오늘·내일·모레, 그 뒤는 D-n.
function relativeDay(days: number): string | null {
  if (days < 0) return null;
  if (days === 0) return "오늘";
  if (days === 1) return "내일";
  if (days === 2) return "모레";
  return `D-${days}`;
}

const joinParts = (...parts: (string | null | false)[]) => parts.filter(Boolean).join(" · ");

export function toSessionCard(
  game: SessionGame,
  role: SessionRole,
  ctx: SessionContext,
): SessionCardModel {
  const now = ctx.now ?? new Date();
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
  const line = scheduleLine(game, now);
  const coordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
  // 조율형이 기한을 넘겼는데 확정자는 있고 세션 시각이 없다: 무산이 아니라 GM이 시간을 정할 차례.
  // (deriveSessionState는 이 경우도 closed로 보므로 여기서 따로 살린다.)
  const awaitingTime =
    coordinate && !game.confirmedAt && line.deadlinePassed && confirmedCount > 0;
  const past = (state === "closed" && !awaitingTime) || state === "finished";
  // 세션 시각이 정해졌는가: 일시 지정형은 등록 때부터, 조율형은 GM이 확정한 뒤.
  const timeSet = Boolean(game.confirmedAt) && (!coordinate || line.confirmed);
  const startsAt = timeSet ? new Date(game.confirmedAt!).toISOString() : null;
  const sessionWhen = startsAt
    ? joinParts(formatDateTime(startsAt), relativeDay(ddayKst(startsAt, now)))
    : null;
  const seats = `${confirmedCount}/${game.maxPlayers}`;
  const scheduleHref = `/games/${game.id}/schedule`;

  const base = {
    id: game.id,
    title: game.title,
    round: game.round,
    role,
    startsAt,
    urgent: !past && !timeSet && isDeadlineUrgent(game.endDate, now),
  };

  if (past) {
    const finished = state === "finished" && game.confirmedAt;
    return {
      ...base,
      bucket: "past",
      chip: null,
      badge: finished ? "끝남" : "모집 마감",
      badgeColor: "gray",
      schedule: finished
        ? `${formatDateTime(game.confirmedAt!)} 진행`
        : `${formatDate(game.endDate)}에 모집 마감`,
      scheduleTone: "hint",
      meta: joinParts(game.rule, role === "player" && `GM ${game.gm?.username ?? "?"}`, seats),
      action: null,
      // 최근에 끝난 것부터
      sortKey: -new Date(game.confirmedAt ?? game.endDate).getTime(),
    };
  }

  const sortKey = new Date(startsAt ?? game.endDate).getTime();

  if (role === "host") {
    const status = deriveGameStatus({
      maxPlayers: game.maxPlayers,
      endDate: game.endDate,
      participantCount: confirmedCount,
      waitlistEnabled: game.waitlistEnabled,
    });
    const needsTime = awaitingTime;
    const responses = ctx.responseCounts.get(game.id) ?? 0;
    return {
      ...base,
      bucket: "hosted",
      chip: state === "confirmed" ? "confirmed" : "recruiting",
      badge: gameStatusLabel[status],
      badgeColor: gameStatusColor[status],
      schedule: needsTime
        ? "기한이 지났는데 세션 시간이 없습니다"
        : (sessionWhen ?? joinParts(line.text, line.deadline)),
      scheduleTone: needsTime ? "warning" : line.confirmed ? "success" : "normal",
      meta: joinParts(
        game.rule,
        coordinate && !timeSet && `응답 ${responses}/${confirmedCount}`,
        `확정 ${seats}`,
      ),
      action: needsTime
        ? { kind: "confirm-time", label: "세션 시간 확정하기", href: scheduleHref }
        : null,
      sortKey,
    };
  }

  const meta = joinParts(game.rule, `GM ${game.gm?.username ?? "?"}`, seats);
  const { waiting } = splitRoster(game.participants);
  const waitRank = waiting.find((p) => p.userId === ctx.viewerId)?.waitlistRank ?? null;

  if (waitRank !== null) {
    return {
      ...base,
      bucket: "joined",
      chip: "waiting",
      badge: `대기 ${waitRank}번`,
      badgeColor: "gray",
      schedule: sessionWhen ?? joinParts(line.text, line.deadline),
      scheduleTone: "normal",
      meta,
      action: null,
      sortKey,
    };
  }

  if (timeSet) {
    return {
      ...base,
      bucket: "joined",
      chip: "confirmed",
      badge: "확정",
      badgeColor: "success",
      schedule: sessionWhen!,
      scheduleTone: "success",
      meta,
      action: null,
      sortKey,
    };
  }

  // 일정 미정인 확정 참여자 = 조율 중. 가능 시간을 안 냈으면 그게 지금 할 일이다.
  const needsResponse = !ctx.respondedGameIds.has(game.id) && !line.deadlinePassed;
  return {
    ...base,
    bucket: "joined",
    chip: "scheduling",
    badge: "조율 중",
    badgeColor: "primary",
    schedule: needsResponse
      ? joinParts("가능 시간 미제출", line.deadline)
      : awaitingTime
        ? "모집이 끝나 GM이 세션 시간을 정하는 중입니다"
        : joinParts(line.text, line.deadline),
    scheduleTone: needsResponse ? "warning" : "normal",
    meta,
    action: needsResponse
      ? { kind: "submit-availability", label: "일정 조율", href: scheduleHref }
      : null,
    sortKey,
  };
}

export type MySessions = Record<SessionBucket, SessionCardModel[]>;

// 운영·참여 게임을 카드로 바꿔 세 탭으로 나누고, 가까운 것부터 정렬한다.
export function buildSessions({
  hosted,
  joined,
  ...ctx
}: SessionContext & { hosted: SessionGame[]; joined: SessionGame[] }): MySessions {
  const cards = [
    ...hosted.map((game) => toSessionCard(game, "host", ctx)),
    ...joined.map((game) => toSessionCard(game, "player", ctx)),
  ].toSorted((a, b) => a.sortKey - b.sortKey);

  return {
    joined: cards.filter((c) => c.bucket === "joined"),
    hosted: cards.filter((c) => c.bucket === "hosted"),
    past: cards.filter((c) => c.bucket === "past"),
  };
}

export const SESSION_TABS = [
  { key: "joined", label: "참여 중" },
  { key: "hosted", label: "내가 운영" },
  { key: "past", label: "끝남" },
] as const satisfies ReadonlyArray<{ key: SessionBucket; label: string }>;

// 탭별 상태 칩. 목록(05)과 같은 primary 칩을 쓴다. 끝남 탭에는 칩이 없다.
export const SESSION_CHIPS: Record<SessionBucket, ReadonlyArray<{ key: SessionChip | "all"; label: string }>> = {
  joined: [
    { key: "all", label: "전체" },
    { key: "scheduling", label: "조율 중" },
    { key: "confirmed", label: "확정" },
    { key: "waiting", label: "대기" },
  ],
  hosted: [
    { key: "all", label: "전체" },
    { key: "recruiting", label: "모집 중" },
    { key: "confirmed", label: "확정" },
  ],
  past: [],
};
