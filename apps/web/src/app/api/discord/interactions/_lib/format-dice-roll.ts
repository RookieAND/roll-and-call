import { DISCORD_COLOR, type DiscordEmbed } from "@roll-and-call/discord";

type DiceRoll = { expression: string; detail: string; total: number };

export function formatDiceRoll(playerName: string, roll: DiceRoll): DiscordEmbed {
  return {
    title: `🎲 주사위 · ${playerName}`,
    description: `\`${roll.expression}\` → ${roll.detail} = **${roll.total}**`,
    color: DISCORD_COLOR.roll,
  };
}
