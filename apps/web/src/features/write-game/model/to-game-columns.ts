import { RECRUIT_METHOD } from "@/entities/game";
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
    genres: values.genres,
    triggers: values.triggers,
    platforms: values.platforms,
    notice: values.notice || null,
    maxPlayers: Number(values.maxPlayers),
    recruitMethod: values.recruitMethod,
    // 추첨은 정원과 무관하게 받으므로 대기 접수 설정을 쓰지 않는다.
    waitlistEnabled:
      values.recruitMethod === RECRUIT_METHOD.firstCome ? values.waitlistEnabled : true,
    scheduleMode: values.scheduleMode,
    endDate: fromKstDateTimeInput(values.endDate),
    rangeStart: values.rangeStart || null,
    rangeEnd: values.rangeEnd || null,
    confirmedAt: values.confirmedAt ? fromKstDateTimeInput(values.confirmedAt) : null,
  };
}
