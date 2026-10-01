import type { BadgeLadderKey } from "./badge-ladder";

export function badgeKey({
  ladder,
  subject,
}: {
  ladder: BadgeLadderKey;
  subject?: string;
}): string {
  return subject ? `${ladder}.${subject}` : ladder;
}
