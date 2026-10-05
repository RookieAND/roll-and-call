// 대표 뱃지 한 칸. 가장 높은 단계는 키 그대로(올라가면 따라간다), 낮은 단계는 "키@단계"로 고정한다.
export function featuredEntry({
  key,
  tier,
  heldTier,
}: {
  key: string;
  tier: number;
  heldTier: number;
}): string {
  return tier < heldTier ? `${key}@${tier}` : key;
}
