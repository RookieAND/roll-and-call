"use server";

import { listSanctionedUserIds } from "@roll-and-call/database/moderation";
import { searchMembers } from "@roll-and-call/database/profiles";
import { z } from "zod";

import { parseActionInput } from "@/shared/api";
import { getActingMember } from "@/shared/server";

import type { Candidate } from "../model/candidate";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 20;
const QUERY_MAX_LENGTH = 200;

const querySchema = z.string().max(QUERY_MAX_LENGTH);

export async function searchProfiles(input: string): Promise<Candidate[]> {
  const parsed = parseActionInput(querySchema, input);
  if (!parsed.ok) return [];
  const query = parsed.data;
  const keyword = query.trim();
  if (keyword.length < MIN_QUERY_LENGTH) return [];

  const member = await getActingMember();
  if (!member) return [];
  const { server, user } = member;
  const found = await searchMembers({
    serverId: server.id,
    excludeUserId: user.id,
    keyword,
    limit: RESULT_LIMIT,
  });
  const sanctioned = new Set(
    await listSanctionedUserIds({
      serverId: server.id,
      userIds: found.map((profile) => profile.userId),
    }),
  );
  return found.map((profile) => ({
    ...profile,
    status: null,
    sanctioned: sanctioned.has(profile.userId),
  }));
}
