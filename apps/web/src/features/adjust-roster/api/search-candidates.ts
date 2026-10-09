"use server";

import { findGameGmId, searchGameCandidates } from "@roll-and-call/database/games";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/api";
import { getActingMember } from "@/shared/server";

import type { Candidate } from "../model/candidate";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 20;
const QUERY_MAX_LENGTH = 200;

const inputSchema = z.object({ gameId: idSchema, query: z.string().max(QUERY_MAX_LENGTH) });

export async function searchCandidates(input: z.input<typeof inputSchema>): Promise<Candidate[]> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return [];
  const { gameId, query } = parsed.data;
  const keyword = query.trim();
  if (keyword.length < MIN_QUERY_LENGTH) return [];

  const member = await getActingMember();
  if (!member) return [];
  const { server, user } = member;
  const gmId = await findGameGmId({ serverId: server.id, gameId });
  if (gmId !== user.id) return [];

  return searchGameCandidates({
    serverId: server.id,
    gameId,
    excludeUserId: user.id,
    keyword,
    limit: RESULT_LIMIT,
  });
}
