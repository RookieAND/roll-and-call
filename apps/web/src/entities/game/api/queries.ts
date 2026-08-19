import {
  and,
  asc,
  desc,
  eq,
  gt,
  ilike,
  isNotNull,
  lte,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db, games, participants } from "@/shared/api/db";
import { GAME_STATUS, type GameStatus } from "../model/status";

export const GAMES_PAGE_SIZE = 12;

export type GamesFilter = {
  q?: string;
  status?: GameStatus;
  sort?: "latest" | "deadline";
};

export async function getGamesPage(
  page: number,
  filter: GamesFilter = {},
  pageSize = GAMES_PAGE_SIZE,
) {
  const now = new Date();
  const conds: SQL[] = [];
  if (filter.q) {
    conds.push(
      or(ilike(games.title, `%${filter.q}%`), ilike(games.rule, `%${filter.q}%`))!,
    );
  }
  // Status mirrors deriveGameStatus: 마감=기한 경과 / 확정=정원 충족 / 모집중=나머지.
  // ponytail: inner alias "p" + raw column, else RQB re-aliases participants.gameId to the outer games table → "games"."game_id" (does not exist).
  const filled = sql`(select count(*) from ${participants} "p" where "p"."game_id" = ${games.id}) >= ${games.maxPlayers}`;
  if (filter.status === GAME_STATUS.closed) conds.push(lte(games.endDate, now));
  if (filter.status === GAME_STATUS.confirmed) {
    conds.push(and(gt(games.endDate, now), filled)!);
  }
  if (filter.status === GAME_STATUS.recruiting) {
    conds.push(and(gt(games.endDate, now), sql`not (${filled})`)!);
  }
  const where = conds.length > 0 ? and(...conds) : undefined;
  const orderBy =
    filter.sort === "deadline" ? asc(games.endDate) : desc(games.createdAt);

  const offset = (Math.max(1, page) - 1) * pageSize;
  const [rows, total] = await Promise.all([
    db.query.games.findMany({
      where,
      orderBy,
      with: {
        gm: { columns: { username: true, avatarUrl: true } },
        participants: { columns: { userId: true } },
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
      participants: { columns: { userId: true } },
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
          participants: { columns: { userId: true } },
        },
      },
    },
  });
  return rows.map((r) => r.game);
}

export type GameDetailData = NonNullable<
  Awaited<ReturnType<typeof getGameById>>
>;

export async function getGameById(id: string) {
  return db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, id),
    with: {
      gm: { columns: { username: true, avatarUrl: true } },
      participants: {
        columns: { userId: true },
        with: { user: { columns: { username: true, avatarUrl: true } } },
      },
    },
  });
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
    .leftJoin(
      participants,
      and(
        eq(participants.gameId, games.id),
        eq(participants.userId, userId),
      ),
    )
    .where(
      and(
        isNotNull(games.confirmedAt),
        ne(games.id, excludeGameId),
        or(eq(games.gmId, userId), eq(participants.userId, userId)),
      ),
    );

  return rows.map((r) => r.confirmedAt!.toISOString());
}
