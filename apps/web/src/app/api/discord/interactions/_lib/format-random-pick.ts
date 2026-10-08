import { DISCORD_COLOR, type DiscordEmbed } from "@roll-and-call/discord";

export function formatRandomPick({
  playerName,
  options,
  picked,
}: {
  playerName: string;
  options: string[];
  picked: string;
}): DiscordEmbed {
  return {
    title: `🎲 선택 · ${playerName}`,
    description: `${options.join(" · ")}\n## ${picked}`,
    color: DISCORD_COLOR.roll,
  };
}
