import "server-only";
import { getDiscordId } from "@roll-and-call/database/profiles";
import { listJoinCandidateServers } from "@roll-and-call/database/servers";
import { isUndefined } from "es-toolkit";

import { isDiscordGuildMember } from "./is-discord-guild-member";

// 아직 가입하지 않았지만 디스코드 서버 멤버라 바로 가입할 수 있는 서버. 확인이 안 되는 서버는 뺀다.
export async function listJoinableServers(userId: string) {
  const [discordId, candidates] = await Promise.all([
    getDiscordId(userId),
    listJoinCandidateServers(userId),
  ]);
  if (isUndefined(discordId)) return [];
  const checks = await Promise.all(
    candidates.map((server) =>
      isDiscordGuildMember(server.discordGuildId, discordId).catch(() => false),
    ),
  );
  return candidates
    .filter((_, index) => checks[index])
    .map(({ slug, name, icon, returning }) => ({ slug, name, icon, returning }));
}
