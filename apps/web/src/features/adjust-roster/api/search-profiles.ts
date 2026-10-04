"use server";

import { listSanctionedUserIds } from "@roll-and-call/database/moderation";
import { searchMembers } from "@roll-and-call/database/profiles";

import { getActingMember } from "@/shared/server";

import type { Candidate } from "../model/candidate";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 20;

export async function searchProfiles(query: string): Promise<Candidate[]> {
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
