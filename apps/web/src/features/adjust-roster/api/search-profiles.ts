"use server";

import { and, eq, ilike, ne, or } from "drizzle-orm";

import { db, getCurrentUser, profiles } from "@/shared/server";

import type { Candidate } from "../model/candidate";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 20;

// 구인을 올리기 전이라 게임이 없다. 로그인한 사람만, 본인을 빼고 찾는다.
export async function searchProfiles(query: string): Promise<Candidate[]> {
  const keyword = query.trim();
  if (keyword.length < MIN_QUERY_LENGTH) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const pattern = `%${keyword.replace(/[\\%_]/g, "\\$&")}%`;
  const found = await db
    .select({
      userId: profiles.id,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
      bio: profiles.bio,
    })
    .from(profiles)
    .where(
      and(
        ne(profiles.id, user.id),
        or(ilike(profiles.username, pattern), eq(profiles.discordId, keyword)),
      ),
    )
    .orderBy(profiles.username)
    .limit(RESULT_LIMIT);
  return found.map((profile) => ({ ...profile, status: null }));
}
