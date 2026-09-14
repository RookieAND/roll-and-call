import "server-only";

import { and, eq, inArray, isNotNull, ne, or, sql } from "drizzle-orm";
import { availabilities, db, games, participants } from "./db";

// 이 사용자가 가능 시간을 한 칸이라도 낸 게임 id. 홈·내 세션의 "가능 시간 미제출" 할 일이 쓴다.
export async function getRespondedGameIds(userId: string): Promise<Set<string>> {
  const rows = await db
    .selectDistinct({ gameId: availabilities.gameId })
    .from(availabilities)
    .where(eq(availabilities.userId, userId));
  return new Set(rows.map((r) => r.gameId));
}

// 게임별로 가능 시간을 낸 확정 참여자 수. GM 카드의 "응답 n/확정 m"이 쓴다.
export async function getResponseCounts(gameIds: string[]): Promise<Map<string, number>> {
  if (gameIds.length === 0) return new Map();
  const rows = await db
    .select({
      gameId: availabilities.gameId,
      count: sql<number>`count(distinct ${availabilities.userId})::int`,
    })
    .from(availabilities)
    .innerJoin(
      participants,
      and(
        eq(participants.gameId, availabilities.gameId),
        eq(participants.userId, availabilities.userId),
        eq(participants.status, "confirmed"),
      ),
    )
    .where(inArray(availabilities.gameId, gameIds))
    .groupBy(availabilities.gameId);
  return new Map(rows.map((r) => [r.gameId, Number(r.count)]));
}

// 이 게임에 가능 시간을 한 칸이라도 낸 사용자 id. 상세의 "응답 n/m"과 참여자 관리의 미제출 표시가 쓴다.
export async function getRespondedUserIds(gameId: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ userId: availabilities.userId })
    .from(availabilities)
    .where(eq(availabilities.gameId, gameId));
  return rows.map((r) => r.userId);
}

export async function getGameAvailabilities(gameId: string) {
  return db.query.availabilities.findMany({
    where: (a, { eq: eqOp }) => eqOp(a.gameId, gameId),
    with: { user: { columns: { username: true } } },
  });
}

const SLOT_MS = 30 * 60 * 1000;
// 플레이타임이 비어 있는 게임은 흔한 길이(3시간)만큼 막는다.
const DEFAULT_PLAY_MINUTES = 180;

// "3시간 30분" → 210. 읽을 수 없으면 기본 길이.
function playMinutes(playTime: string | null): number {
  if (!playTime) return DEFAULT_PLAY_MINUTES;
  const hours = Number(playTime.match(/(\d+)\s*시간/)?.[1] ?? 0);
  const minutes = Number(playTime.match(/(\d+)\s*분/)?.[1] ?? 0);
  return hours * 60 + minutes || DEFAULT_PLAY_MINUTES;
}

// 사용자가 GM이거나 참여 중인 "다른" 확정 세션이 차지하는 30분 칸(ISO) 전부.
// 시작 칸만이 아니라 플레이타임 길이만큼 격자에서 막는다.
export async function getUserConfirmedSlots(
  userId: string,
  excludeGameId: string,
): Promise<string[]> {
  const rows = await db
    .selectDistinct({ confirmedAt: games.confirmedAt, playTime: games.playTime })
    .from(games)
    .leftJoin(participants, and(eq(participants.gameId, games.id), eq(participants.userId, userId)))
    .where(
      and(
        isNotNull(games.confirmedAt),
        ne(games.id, excludeGameId),
        or(eq(games.gmId, userId), eq(participants.userId, userId)),
      ),
    );

  const slots = new Set<string>();
  for (const row of rows) {
    // 30분 경계로 내린다(KST +9h도 30분의 배수라 UTC에서 내려도 같은 칸).
    const start = Math.floor(row.confirmedAt!.getTime() / SLOT_MS) * SLOT_MS;
    const end = row.confirmedAt!.getTime() + playMinutes(row.playTime) * 60 * 1000;
    for (let t = start; t < end; t += SLOT_MS) slots.add(new Date(t).toISOString());
  }
  return [...slots];
}
