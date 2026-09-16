import { fromKstDateTimeInput } from "@/shared/lib";

import type { GameFormValues } from "./game-form";

export function toGameColumns(values: GameFormValues) {
  return {
    title: values.title,
    rule: values.rule,
    synopsis: values.synopsis || null,
    thumbnailUrl: values.thumbnailUrl || null,
    thumbnailSpoiler: Boolean(values.thumbnailUrl) && values.thumbnailSpoiler,
    images: values.images,
    playTime: values.playTime || null,
    maxPlayers: Number(values.maxPlayers),
    waitlistEnabled: values.waitlistEnabled,
    scheduleMode: values.scheduleMode,
    endDate: fromKstDateTimeInput(values.endDate),
    rangeStart: values.rangeStart || null,
    rangeEnd: values.rangeEnd || null,
    confirmedAt: values.confirmedAt ? fromKstDateTimeInput(values.confirmedAt) : null,
  };
}
