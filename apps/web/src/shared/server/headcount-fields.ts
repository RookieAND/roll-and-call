import type { DiscordEmbedField } from "@trpg/discord";

export function headcountFields(
  confirmedCount: number,
  maxPlayers: number,
  waitingCount = 0,
): DiscordEmbedField[] {
  const fields = [{ name: "👥 인원", value: `${confirmedCount}/${maxPlayers}명`, inline: true }];
  if (waitingCount > 0) fields.push({ name: "⏳ 대기", value: `${waitingCount}명`, inline: true });
  return fields;
}
