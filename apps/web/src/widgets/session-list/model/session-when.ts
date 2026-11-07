import { ddayKst, formatDateTime } from "@/shared/lib";

import { joinParts } from "./join-parts";
import { relativeDay } from "./relative-day";

export function sessionWhen({ startsAt, now }: { startsAt: Date; now: Date }): string {
  return joinParts(formatDateTime(startsAt), relativeDay(ddayKst(startsAt, now)));
}
