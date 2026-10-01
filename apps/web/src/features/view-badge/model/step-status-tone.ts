import { BADGE_TONE } from "@/entities/badge";

export function stepStatusTone({
  earned,
  firstLocked,
  count,
}: {
  earned: boolean;
  firstLocked: boolean;
  count: number | null;
}) {
  if (earned) return BADGE_TONE.success;
  if (firstLocked && count !== null) return BADGE_TONE.primary;
  return BADGE_TONE.hint;
}
