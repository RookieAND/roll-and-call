import "server-only";
import { getGuild } from "@roll-and-call/discord";
import { unstable_cache } from "next/cache";

// 서버 화면마다 부르므로 5분 캐시한다. 봇이 빠진 서버는 null.
// ponytail: unstable_cache를 쓴다. cacheComponents를 켜면 "use cache" + cacheLife로 바꾼다.
export const fetchGuild = unstable_cache(
  async (guildId: string) => {
    const guild = await getGuild({ guildId });
    if (!guild) return null;
    // servers.icon은 사용자 앱과 같이 쓰는 이미지 주소다.
    const icon = guild.icon && `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    return { name: guild.name, icon, ownerDiscordId: guild.owner_id };
  },
  ["admin-discord-guild"],
  { revalidate: 300 },
);
