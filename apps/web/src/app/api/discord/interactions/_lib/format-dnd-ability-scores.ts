import { DISCORD_COLOR, type DiscordEmbed } from "@roll-and-call/discord";

import type { rollDndAbilityScores } from "./roll-dnd-ability-scores";

export function formatDndAbilityScores({
  playerName,
  scores,
}: {
  playerName: string;
  scores: ReturnType<typeof rollDndAbilityScores>;
}): DiscordEmbed {
  const lines = scores.map(
    ({ label, kept, dropped, total }) =>
      `${label} **${total}**  (${kept.join(", ")} · ~~${dropped}~~)`,
  );
  return {
    title: `🎲 능력치 · ${playerName}`,
    description: lines.join("\n"),
    color: DISCORD_COLOR.roll,
    footer: { text: "DnD 5판 · 4d6에서 가장 낮은 눈을 버렸어요" },
  };
}
