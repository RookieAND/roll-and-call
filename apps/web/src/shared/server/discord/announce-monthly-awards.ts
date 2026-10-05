import { loadMonthlyWinners } from "@roll-and-call/database/badges";
import {
  isMonthSettled,
  nextMonthStart,
  previousMonthKey,
} from "@roll-and-call/database/badges/model";
import { claimMonthlyAnnouncement, listServers } from "@roll-and-call/database/servers";
import { sendDiscordMessage } from "@roll-and-call/discord";
import { messageHeadInput } from "@roll-and-call/game-notices";

import { serverPath } from "@/shared/lib";

import { siteOrigin } from "../site-origin";
import { monthlyAnnouncementText } from "./monthly-announcement-text";

const ANNOUNCE_DEADLINE_MS = 14 * 24 * 60 * 60 * 1000;

// 매달 8일 그 서버의 공지 채널에 지난달 이달의 GM·PL을 한 번 올린다(R6). 보낸 서버 수를 돌려준다.
// 굳은 뒤 7일(15일 00:00 KST)이 지나면 올리지 않는다. 배포가 늦은 달에 지난 발표를 뒤늦게 올리지 않기 위해서다.
export async function announceMonthlyAwards({ now }: { now: Date }): Promise<number> {
  const month = previousMonthKey(now);
  const deadline = nextMonthStart(month).getTime() + ANNOUNCE_DEADLINE_MS;
  if (!isMonthSettled(month, now) || now.getTime() >= deadline) return 0;
  const origin = siteOrigin();
  if (!origin) {
    console.warn("Site origin not set; skipping monthly announcement");
    return 0;
  }

  let announced = 0;
  for (const server of await listServers()) {
    if (!server.announceChannelId) continue;
    const { gm, pl } = await loadMonthlyWinners({ serverId: server.id, month });
    if (gm.length === 0 && pl.length === 0) continue;
    if (!(await claimMonthlyAnnouncement({ serverId: server.id, month }))) continue;
    const body = monthlyAnnouncementText({
      month,
      gm,
      pl,
      profileUrl: (userId) =>
        `${origin}${serverPath({ slug: server.slug, path: `/users/${userId}` })}`,
    });
    const input = await messageHeadInput({
      serverId: server.id,
      key: "monthly",
      values: { 달: `${Number(month.slice(5))}월` },
      after: body,
    });
    await sendDiscordMessage({ channelId: server.announceChannelId, input });
    announced += 1;
  }
  return announced;
}
