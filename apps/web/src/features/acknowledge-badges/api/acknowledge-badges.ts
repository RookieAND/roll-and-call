"use server";

import { markBadgesNotified } from "@roll-and-call/database/badges";

import { type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError } from "@/shared/server";

// 획득 시트를 닫으면 보여 준 뱃지만 알린 것으로 적는다. 그 사이 새로 받은 뱃지는 다음 방문에 뜬다.
export async function acknowledgeBadges(keys: string[]): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
  if (keys.length === 0) return {};

  await markBadgesNotified({ serverId: server.id, userId: user.id, badgeKeys: keys });
  return {};
}
