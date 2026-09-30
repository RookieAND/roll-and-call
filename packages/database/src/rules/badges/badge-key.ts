import type { BadgeLadderKey } from "./badge-ladder";

// subject는 룰 분류 id 또는 달(2026-09). 누적·다양성·후기 뱃지는 사다리 키 그대로다.
export function badgeKey(ladder: BadgeLadderKey, subject?: string): string {
  return subject ? `${ladder}.${subject}` : ladder;
}
