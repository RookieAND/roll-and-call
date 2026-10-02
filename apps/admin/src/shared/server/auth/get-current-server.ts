import "server-only";
import { getServerBySlug, syncServerGuild } from "@roll-and-call/database/servers";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";

import { SERVER_SLUG_HEADER } from "@/shared/lib";

import { fetchGuild } from "./fetch-guild";

// 주소의 slug(proxy가 헤더로 넘김)로 지금 서버를 정한다. 들어올 때마다 디스코드 길드 정보로
// 이름·아이콘·서버장을 맞추고, 봇이 빠졌으면 botConnected를 끈다.
export const getCurrentServer = cache(async () => {
  const slug = (await headers()).get(SERVER_SLUG_HEADER);
  const server = slug ? await getServerBySlug(slug) : undefined;
  if (!server) notFound();
  const guild = await fetchGuild(server.discordGuildId).catch((error: unknown) => {
    // 봇 토큰이 없거나 디스코드가 응답하지 않으면 마지막으로 맞춘 값을 그대로 쓴다.
    console.error(error);
    return undefined;
  });
  if (guild === null) return { ...server, botConnected: false };
  const synced = guild ? await syncServerGuild({ server, guild }) : server;
  return { ...synced, botConnected: true };
});

export type CurrentServer = Awaited<ReturnType<typeof getCurrentServer>>;
