import { DISCORD_COLOR, type DiscordEmbed } from "@roll-and-call/discord";

import { abilityScoreTable } from "./ability-score-table";

type AbilityScore = { label: string; columns: number[] };

export function formatAbilityScores(playerName: string, scores: AbilityScore[]): DiscordEmbed {
  return {
    title: `🎲 능력치 · ${playerName}`,
    description: `\`\`\`\n${abilityScoreTable(scores)}\n\`\`\``,
    color: DISCORD_COLOR.roll,
    footer: { text: "세로로 한 줄을 골라 쓰세요" },
  };
}
