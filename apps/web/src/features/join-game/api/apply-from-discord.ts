import "server-only";
import { getUserIdByDiscordId } from "@roll-and-call/database/profiles";
import { getActiveMembership, getServerByGuildId } from "@roll-and-call/database/servers";

import { RECRUIT_METHOD } from "@/entities/game";
import { serverPath } from "@/shared/lib";
import { siteOrigin } from "@/shared/server";

import { joinSuccessMessage } from "../model/join-success-message";
import { applyToGame } from "./apply-to-game";
import { finishApplication } from "./finish-application";

// 디스코드 버튼으로 온 신청. discordId는 서명을 확인한 인터랙션에서 온 값이라 그대로 믿는다.
export async function applyFromDiscord({
  guildId,
  discordId,
  gameId,
}: {
  guildId: string;
  discordId: string;
  gameId: string;
}): Promise<string> {
  const server = await getServerByGuildId(guildId);
  if (!server) return "이 서버에서는 신청할 수 없습니다.";

  const userId = await getUserIdByDiscordId(discordId);
  const membership = userId && (await getActiveMembership({ serverId: server.id, userId }));
  if (!userId || !membership) {
    const url = `${siteOrigin() ?? ""}${serverPath({ slug: server.slug, path: `/games/${gameId}` })}`;
    return `아직 가입하지 않았습니다. 가입한 뒤 신청해 주세요. ${url}`;
  }

  const application = await applyToGame({ serverId: server.id, gameId, userId });
  if ("error" in application) return application.error;

  await finishApplication({ server, userId, application });
  return joinSuccessMessage({
    waiting: application.waiting,
    lottery: application.game.recruitMethod === RECRUIT_METHOD.lottery,
  });
}
