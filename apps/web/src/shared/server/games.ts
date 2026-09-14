import "server-only";
import { and, asc, desc, eq, gt, ilike, isNull, lte, not, or, sql, type SQL } from "drizzle-orm";
import type { GamesFilter } from "@/shared/api";
import { getRespondedUserIds } from "./availabilities";
import { db, games, participants } from "./db";

export const GAMES_PAGE_SIZE = 12;

// 구인 목록. 플레이가 끝난 게임은 늘 뺀다. 상태 필터는 모집 상태 배지(deriveGameStatus)와 같은 기준으로 거른다:
// 모집 중 = 기한 안 · 자리 있음 / 대기 접수 중 = 기한 안 · 정원 참 · 대기 받음 / 마감 = 기한 지남 또는 정원 참 · 대기 안 받음.
// status가 없으면 기한 안 글 전부(랜딩 "지금 모집 중").
export async function getRecruitingGamesPage(
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

  // ponytail: inner alias "p" + raw column, else RQB re-aliases participants.gameId to the outer games table → "games"."game_id" (does not exist).
  // 정원은 확정 인원으로만 센다(대기자는 자리를 차지하지 않는다).
  const confirmedCount = sql`(select count(*) from ${participants} "p" where "p"."game_id" = ${games.id} and "p"."status" = 'confirmed')`;
  const full = sql`${confirmedCount} >= ${games.maxPlayers}`;
  const open = gt(games.endDate, now);
  switch (filter.status) {
    case undefined:
      conds.push(open);
      break;
    case "recruiting":
      conds.push(open, not(full));
      break;
    case "waitlist":
      conds.push(open, full, eq(games.waitlistEnabled, true));
      break;
    case "closed":
      conds.push(or(lte(games.endDate, now), and(full, eq(games.waitlistEnabled, false)))!);
      break;
    case "all":
      break;
  }
  const where = and(...conds);
  const remaining = sql`${games.maxPlayers} - ${confirmedCount}`;
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
      gm: { columns: { id: true, username: true, avatarUrl: true, discordAutoOpen: true } },
      participants: {
        columns: { userId: true, joinedAt: true, status: true },
        with: { user: { columns: { username: true, avatarUrl: true } } },
      },
    },
  });
  if (!game) return null;

  return { game, availableUserIds: new Set(await getRespondedUserIds(gameId)) };
}
