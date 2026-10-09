"use server";

import { z } from "zod";

import { parseActionInput, type ActionResult } from "@/shared/api";
import { getActingMember, markBadgesNotified, notMemberError } from "@/shared/server";

const BADGE_KEYS_MAX = 200;

const keysSchema = z.array(z.string().max(100)).max(BADGE_KEYS_MAX);

// 획득 시트를 닫으면 보여 준 뱃지만 알린 것으로 적는다. 그 사이 새로 받은 뱃지는 다음 방문에 뜬다.
export async function acknowledgeBadges(input: string[]): Promise<ActionResult> {
  const parsed = parseActionInput(keysSchema, input);
  if (!parsed.ok) return parsed.result;
  const keys = parsed.data;
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
  if (keys.length === 0) return {};

  await markBadgesNotified({ serverId: server.id, userId: user.id, badgeKeys: keys });
  return {};
}
