import type { ActionResult } from "@/shared/api";

export function fixedAfterDeadlineError({
  game,
  startsAt,
}: {
  game: { endDate: Date };
  startsAt: Date;
}): ActionResult | null {
  if (startsAt.getTime() <= game.endDate.getTime()) {
    return { error: "모집 마감 뒤의 시각을 골라 주세요." };
  }
  return null;
}
