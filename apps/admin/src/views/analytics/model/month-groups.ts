// 「9월 4주차」 라벨을 이어진 달끼리 묶어 막대 아래 달 표시(칸 수)로 쓴다.
export function monthGroups(labels: string[]) {
  const groups: { month: string; span: number }[] = [];
  for (const label of labels) {
    const month = label.split(" ")[0] ?? label;
    const last = groups.at(-1);
    if (last?.month === month) last.span += 1;
    else groups.push({ month, span: 1 });
  }
  return groups;
}
