import type { GuildSnapshot } from "./guild-snapshot";

// 저장 전 채널은 디스코드에서 이름을 읽어 보이고, 지워졌거나 못 읽으면 ID를 그대로 남긴다.
export function previousChannelLabel({
  id,
  guild,
}: {
  id: string | null;
  guild: GuildSnapshot | null;
}) {
  if (!id) return null;
  const channel = guild?.channels.find((candidate) => candidate.id === id);
  return channel ? `#${channel.name}` : `ID ${id}`;
}
