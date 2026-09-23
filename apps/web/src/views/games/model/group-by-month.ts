import { toKst } from "@/shared/lib";

// 지난 구인을 끝난 달로 묶는다. 올해가 아니면 연도를 붙인다.
export function groupByMonth<Item>({
  items,
  finishedAt,
  now = new Date(),
}: {
  items: Item[];
  finishedAt: (item: Item) => Date;
  now?: Date;
}) {
  const thisYear = toKst(now).year();
  const groups: { key: string; label: string; items: Item[] }[] = [];
  for (const item of items) {
    const month = toKst(finishedAt(item));
    const key = month.format("YYYY-MM");
    const last = groups.at(-1);
    if (last?.key === key) {
      last.items.push(item);
      continue;
    }
    const label = month.year() === thisYear ? month.format("M월") : month.format("YYYY년 M월");
    groups.push({ key, label, items: [item] });
  }
  return groups;
}
