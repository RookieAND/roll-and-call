import type { RuleOption } from "./rule-option";

export function ruleSummary({ keys, options }: { keys: string[]; options: RuleOption[] }) {
  const labels = keys.map((key) => options.find((option) => option.key === key)?.label ?? key);
  if (labels.length === 0) return "전체 룰";
  return labels.length === 1 ? labels[0]! : `${labels[0]} 외 ${labels.length - 1}개`;
}
