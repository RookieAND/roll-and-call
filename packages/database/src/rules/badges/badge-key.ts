import type { BadgeLadderKey } from "./badge-ladder";

export function badgeKey(ladder: BadgeLadderKey, subject?: string): string {
  return subject ? `${ladder}.${subject}` : ladder;
}
