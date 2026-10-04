import type { EditionSet, MyRulebook } from "@/entities/rulebook";

export function ownedCategorySub({
  hasEarned,
  editions,
  nearest,
}: {
  hasEarned: boolean;
  editions: string[];
  nearest: { set: EditionSet; missing: MyRulebook[] } | undefined;
}) {
  if (hasEarned) {
    if (editions.length > 0) return `${editions.join(" · ")} 구인을 열 수 있습니다`;
    return "구인을 열 수 있습니다";
  }
  if (nearest) {
    return `${nearest.missing.length}권만 더 인증하면 ${nearest.set.label} GM이 될 수 있습니다`;
  }
  return "기본 룰북을 인증하면 GM이 될 수 있습니다";
}
