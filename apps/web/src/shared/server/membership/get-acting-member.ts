import "server-only";
import { getDiscordId } from "@roll-and-call/database/profiles";
import { getActiveMembership } from "@roll-and-call/database/servers";
import { after } from "next/server";

import { getCurrentServer } from "../auth/get-current-server";
import { getCurrentUser } from "../auth/get-current-user";
import { handleMemberLeft } from "./handle-member-left";
import { hasLeftDiscordGuild } from "./has-left-discord-guild";

// 서버 액션용. 쿠키 값을 믿지 않고 Auth 서버로 확인한 사용자가 지금 서버의 멤버일 때만 돌려준다.
// 디스코드 서버를 나간 사람은 비멤버로 보고, 정리는 응답 뒤에 한다.
export async function getActingMember() {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentUser()]);
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
  return { server, user };
}
