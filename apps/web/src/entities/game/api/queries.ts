import {
  and,
  asc,
  desc,
  eq,
  gt,
  ilike,
  isNotNull,
  isNull,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { availabilities, db, games, participants } from "@/shared/api/db";
import type { GameSort } from "../model/sort";

export const GAMES_PAGE_SIZE = 12;

export type GamesFilter = {
  q?: string;
  sort?: GameSort;
};

export async function getGamesPage(
  page: number,
  filter: GamesFilter = {},
  pageSize = GAMES_PAGE_SIZE,
) {
  const now = new Date();
  const conds: SQL[] = [];
  if (filter.q) {
    conds.push(or(ilike(games.title, `%${filter.q}%`), ilike(games.rule, `%${filter.q}%`))!);
  }
  // 플레이 완료(확정 세션이 지난 게임)는 목록에서 항상 제외한다.
  conds.push(or(isNull(games.confirmedAt), gt(games.confirmedAt, now))!);
  // 목록에는 모집 중(기한 내 + 정원 여유)인 구인만 노출한다.
  // ponytail: inner alias "p" + raw column, else RQB re-aliases participants.gameId to the outer games table → "games"."game_id" (does not exist).
  const filled = sql`(select count(*) from ${participants} "p" where "p"."game_id" = ${games.id}) >= ${games.maxPlayers}`;
  conds.push(and(gt(games.endDate, now), sql`not (${filled})`)!);
  const where = conds.length > 0 ? and(...conds) : undefined;
  const remaining = sql`${games.maxPlayers} - (select count(*) from ${participants} "p" where "p"."game_id" = ${games.id})`;
  const orderBy =
    filter.sort === "deadline"
      ? asc(games.endDate)
      : filter.sort === "slots"
        ? desc(remaining)
        : desc(games.createdAt);

  const offset = (Math.max(1, page) - 1) * pageSize;
  const [rows, total] = await Promise.all([
    db.query.games.findMany({
      where,
      orderBy,
      with: {
        gm: { columns: { username: true, avatarUrl: true } },
        participants: { columns: { userId: true, status: true } },
      },
      limit: pageSize,
      offset,
    }),
    db.$count(games, where),
  ]);
  return { rows, total, pageSize };
}

export async function getGamesByGm(userId: string) {
  return db.query.games.findMany({
    where: (g, { eq: eqOp }) => eqOp(g.gmId, userId),
    orderBy: desc(games.createdAt),
    with: {
      gm: { columns: { username: true, avatarUrl: true } },
      participants: { columns: { userId: true, status: true, joinedAt: true } },
    },
  });
}

export async function getJoinedGames(userId: string) {
  const rows = await db.query.participants.findMany({
    where: (p, { eq: eqOp }) => eqOp(p.userId, userId),
    orderBy: desc(participants.joinedAt),
    with: {
      game: {
        with: {
          gm: { columns: { username: true, avatarUrl: true } },
          participants: {
            columns: { userId: true, status: true, joinedAt: true },
          },
        },
      },
    },
  });
  return rows.map((r) => r.game);
}

export type GameDetailData = NonNullable<Awaited<ReturnType<typeof getGameById>>>;

export async function getGameById(id: string) {
  return db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, id),
    with: {
      gm: { columns: { username: true, avatarUrl: true } },
      participants: {
        columns: { userId: true, joinedAt: true, status: true },
        with: { user: { columns: { username: true, avatarUrl: true } } },
      },
    },
  });
}

export type GameParticipantsData = NonNullable<Awaited<ReturnType<typeof getGameParticipants>>>;

// 참여자 관리 화면(GM 전용)용 데이터. 참여자별 status·신청 순서와,
// "가능 시간 입력" 여부(availabilities 존재)를 함께 돌려준다.
export async function getGameParticipants(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
    with: {
      gm: { columns: { id: true, username: true, avatarUrl: true } },
      participants: {
        columns: { userId: true, joinedAt: true, status: true },
        with: { user: { columns: { username: true, avatarUrl: true } } },
      },
    },
  });
  if (!game) return null;

  const rows = await db
    .selectDistinct({ userId: availabilities.userId })
    .from(availabilities)
    .where(eq(availabilities.gameId, gameId));

  return { game, availableUserIds: new Set(rows.map((r) => r.userId)) };
}

export async function getGameAvailabilities(gameId: string) {
  return db.query.availabilities.findMany({
    where: (a, { eq: eqOp }) => eqOp(a.gameId, gameId),
    with: { user: { columns: { username: true } } },
  });
}

// Confirmed session start times of OTHER games the user is involved in (GM or
// participant). These block the user's grid — only confirmed sessions collide.
export async function getUserConfirmedSlots(
  userId: string,
  excludeGameId: string,
): Promise<string[]> {
  const rows = await db
    .selectDistinct({ confirmedAt: games.confirmedAt })
    .from(games)
    .leftJoin(participants, and(eq(participants.gameId, games.id), eq(participants.userId, userId)))
    .where(
      and(
        isNotNull(games.confirmedAt),
        ne(games.id, excludeGameId),
        or(eq(games.gmId, userId), eq(participants.userId, userId)),
      ),
    );

  return rows.map((r) => r.confirmedAt!.toISOString());
}
