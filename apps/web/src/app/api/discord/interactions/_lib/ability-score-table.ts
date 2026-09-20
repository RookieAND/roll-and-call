type AbilityScore = { label: string; columns: number[] };

// 디스코드 코드블록은 고정폭이고 한글 한 글자는 두 칸을 먹는다. 두 글자 라벨(근력·합계)이
// 네 칸이므로 머리글 들여쓰기도 네 칸, 값은 다섯 칸 오른쪽 정렬로 맞춘다.
const LABEL_WIDTH = 4;
const VALUE_WIDTH = 5;

export function abilityScoreTable(scores: AbilityScore[]) {
  const columnCount = scores[0]?.columns.length ?? 0;
  const cells = (values: (string | number)[]) =>
    values.map((value) => String(value).padStart(VALUE_WIDTH)).join("");

  const header =
    " ".repeat(LABEL_WIDTH) + cells(Array.from({ length: columnCount }, (_, index) => index + 1));
  const rows = scores.map(({ label, columns }) => label + cells(columns));
  const totals = Array.from({ length: columnCount }, (_, index) =>
    scores.reduce((sum, score) => sum + (score.columns[index] ?? 0), 0),
  );
  const divider = "-".repeat(LABEL_WIDTH + VALUE_WIDTH * columnCount);

  return [header, ...rows, divider, "합계" + cells(totals)].join("\n");
}
