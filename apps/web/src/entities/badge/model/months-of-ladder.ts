import { parseBadgeKey, type BadgeLadderKey } from "@roll-and-call/database/badges/model";

// 월간 칭호(이달의 GM·PL)를 받은 달(YYYY-MM), 최근 달이 앞이다.
export function monthsOfLadder({
  ladder,
  records,
}: {
  ladder: BadgeLadderKey;
  records: readonly { badgeKey: string }[];
}): string[] {
  return records
    .flatMap((record) => {
      const parsed = parseBadgeKey(record.badgeKey);
      return parsed?.ladder === ladder && parsed.subject ? [parsed.subject] : [];
    })
    .toSorted()
    .toReversed();
}
