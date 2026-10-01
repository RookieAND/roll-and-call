"use server";

import { searchMembers } from "@roll-and-call/database/profiles";

import { getCurrentServer, getCurrentUser } from "@/shared/server";

import type { Candidate } from "../model/candidate";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 20;

export async function searchProfiles(query: string): Promise<Candidate[]> {
  const keyword = query.trim();
  if (keyword.length < MIN_QUERY_LENGTH) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const server = await getCurrentServer();
  const found = await searchMembers({
    serverId: server.id,
    excludeUserId: user.id,
    keyword,
    limit: RESULT_LIMIT,
  });
  return found.map((profile) => ({ ...profile, status: null }));
}
