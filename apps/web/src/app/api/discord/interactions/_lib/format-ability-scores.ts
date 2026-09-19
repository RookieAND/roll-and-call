type AbilityScore = { label: string; columns: number[] };

export function formatAbilityScores(playerName: string, scores: AbilityScore[]) {
  const rows = scores.map(({ label, columns }) => {
    const values = columns.map((value) => String(value).padStart(2, " ")).join("   ");
    return `${label}   [  ${values}  ]`;
  });
  return [`☞${playerName}☜`, "", "```", ...rows, "```", "세로로 한 줄을 선택합니다."].join("\n");
}
