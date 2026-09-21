"use server";

import { and, eq, ilike, ne, or } from "drizzle-orm";

import { db, games, getCurrentUser, participants, profiles } from "@/shared/server";

import type { Candidate } from "../model/candidate";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 20;

// 직접 확정할 사람을 닉네임이나 디스코드 아이디로 찾는다. GM 본인이 아니면 빈 목록이다.
export async function searchCandidates(gameId: string, query: string): Promise<Candidate[]> {
  const keyword = query.trim();
  if (keyword.length < MIN_QUERY_LENGTH) return [];

  const user = await getCurrentUser();
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
    columns: { gmId: true },
  });
  if (!user || game?.gmId !== user.id) return [];

  const pattern = `%${keyword.replace(/[\\%_]/g, "\\$&")}%`;
  return db
    .select({
      userId: profiles.id,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
      bio: profiles.bio,
      status: participants.status,
    })
    .from(profiles)
    .leftJoin(
      participants,
      and(eq(participants.userId, profiles.id), eq(participants.gameId, gameId)),
    )
    .where(
      and(
        ne(profiles.id, user.id),
        or(ilike(profiles.username, pattern), eq(profiles.discordId, keyword)),
      ),
    )
    .orderBy(profiles.username)
    .limit(RESULT_LIMIT);
}
