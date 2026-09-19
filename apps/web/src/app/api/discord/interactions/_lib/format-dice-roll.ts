type DiceRoll = { expression: string; detail: string; total: number };

export function formatDiceRoll(playerName: string, roll: DiceRoll) {
  return `☞${playerName}☜\n\`${roll.expression}\` → ${roll.detail} = **${roll.total}**`;
}
