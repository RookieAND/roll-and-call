import type { RuleOption } from "./rule-option";

// 룰 이름이나 카테고리 이름에 검색어가 들어간 룰만 남기고, 들어온 순서(카테고리·이름·판)대로 카테고리마다 묶는다.
export function groupRuleOptions({ options, query }: { options: RuleOption[]; query: string }) {
  const keyword = query.trim().toLowerCase();
  const visible = keyword
    ? options.filter(
        (option) =>
          option.label.toLowerCase().includes(keyword) ||
          option.categoryName.toLowerCase().includes(keyword),
      )
    : options;
  const groups: { categoryName: string; options: RuleOption[] }[] = [];
  for (const option of visible) {
    const last = groups.at(-1);
    if (last?.categoryName === option.categoryName) last.options.push(option);
    else groups.push({ categoryName: option.categoryName, options: [option] });
  }
  return groups;
}
