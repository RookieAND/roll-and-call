"use server";

import { findGameGmId, searchGameCandidates } from "@roll-and-call/database/games";

import { getCurrentServer, getCurrentUser } from "@/shared/server";

import type { Candidate } from "../model/candidate";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 20;

export async function searchCandidates({
  gameId,
  query,
}: {
  gameId: string;
  query: string;
}): Promise<Candidate[]> {
  const keyword = query.trim();
  if (keyword.length < MIN_QUERY_LENGTH) return [];

  const [user, server] = await Promise.all([getCurrentUser(), getCurrentServer()]);
  const gmId = await findGameGmId({ serverId: server.id, gameId });
  if (!user || gmId !== user.id) return [];

  return searchGameCandidates({
    serverId: server.id,
    gameId,
    excludeUserId: user.id,
    keyword,
    limit: RESULT_LIMIT,
  });
}
