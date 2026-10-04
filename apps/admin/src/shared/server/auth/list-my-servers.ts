import "server-only";
import { listServerQueueCounts, listStaffServers } from "@roll-and-call/database/servers";
import { isNull } from "es-toolkit";
import { cache } from "react";

import type { StaffRole } from "../admin-data";
import { fetchGuild } from "./fetch-guild";
import { getSessionAccount } from "./get-session-account";

export interface MyServer {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  role: StaffRole;
  joined: boolean;
  botConnected: boolean;
  members: number;
  pending: number;
  certPending: number;
}

// 서버 선택·서버 스위처에 보일 서버. 서버장이거나 운영진인 서버이고, 플랫폼 관리자는 모든 서버다.
export const listMyServers = cache(async (): Promise<MyServer[]> => {
  const account = await getSessionAccount();
  if (!account) return [];
  const servers = await listStaffServers({
    userId: account.userId,
    discordId: account.discordId,
    all: account.platformAdmin,
  });
  const [counts, guilds] = await Promise.all([
    listServerQueueCounts({ serverIds: servers.map((server) => server.id) }),
    Promise.all(servers.map((server) => fetchGuild(server.discordGuildId).catch(() => undefined))),
  ]);
  const mine = servers.map((server, index): MyServer => {
    const queue = counts.get(server.id);
    const owner = account.platformAdmin || server.ownerDiscordId === account.discordId;
    return {
      id: server.id,
      slug: server.slug,
      name: server.name,
      icon: server.icon,
      role: owner ? "owner" : "staff",
      joined: server.joined,
      botConnected: !isNull(guilds[index]),
      members: queue?.members ?? 0,
      pending: queue?.pending ?? 0,
      certPending: queue?.certPending ?? 0,
    };
  });
  // 처리 대기가 있는 서버가 위, 그다음 이름 순이다.
  return mine.toSorted(
    (first, second) =>
      Number(second.pending > 0) - Number(first.pending > 0) ||
      first.name.localeCompare(second.name, "ko"),
  );
});
