import "server-only";
import { getDiscordId } from "@roll-and-call/database/profiles";
import { getActiveMembership } from "@roll-and-call/database/servers";
import { after } from "next/server";
import { cache } from "react";

import { getCurrentServer } from "../auth/get-current-server";
import { getCurrentSessionUser } from "../auth/get-current-session-user";
import { handleMemberLeft } from "./handle-member-left";
import { hasLeftDiscordGuild } from "./has-left-discord-guild";

// 지금 서버에서 로그인한 사람의 멤버십. 비로그인이거나 가입하지 않았으면 null.
// 디스코드 서버를 나간 사람은 바로 비멤버로 보고, 정리는 응답 뒤에 한다.
export const getCurrentMembership = cache(async () => {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!user) return null;
  const [membership, discordId] = await Promise.all([
    getActiveMembership({ serverId: server.id, userId: user.id }),
    getDiscordId(user.id),
  ]);
  if (!membership) return null;
  if (discordId && (await hasLeftDiscordGuild({ server, discordId }))) {
    after(() => handleMemberLeft({ server, userId: user.id }));
    return null;
  }
  return membership;
});
