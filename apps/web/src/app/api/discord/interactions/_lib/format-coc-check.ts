import { DISCORD_COLOR, type DiscordEmbed } from "@roll-and-call/discord";

import type { CocCheckLevel } from "./judge-coc-check";

export function formatCocCheck({
  playerName,
  target,
  modifier,
  roll,
  candidates,
  level,
}: {
  playerName: string;
  target: number;
  modifier: number;
  roll: number;
  candidates: number[];
  level: CocCheckLevel;
}): DiscordEmbed {
  const kind = modifier > 0 ? "보너스" : "페널티";
  const dice =
    modifier === 0 ? "" : ` (${kind} ${Math.abs(modifier)}, 후보 ${candidates.join(" / ")})`;
  return {
    title: `🎲 판정 · ${playerName}`,
    description: `목표값 **${target}** → 1d100 = **${roll}**${dice}\n## ${level}`,
    color: DISCORD_COLOR.roll,
  };
}
