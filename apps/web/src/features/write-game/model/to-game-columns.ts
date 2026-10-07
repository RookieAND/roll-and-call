import { DEFAULT_WINDOW, RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";
import { fromKstDateTimeInput } from "@/shared/lib";

import type { GameFormValues } from "./game-form";

export function toGameColumns(values: GameFormValues) {
  const isFixed = values.scheduleMode === SCHEDULE_MODE.fixed;

  return {
    title: values.title,
    synopsis: values.synopsis || null,
    thumbnailUrl: values.thumbnailUrl || null,
    thumbnailSpoiler: Boolean(values.thumbnailUrl) && values.thumbnailSpoiler,
    images: values.images,
    playMinutes: values.playMinutes,
    genres: values.genres,
    triggers: values.triggers,
    platforms: values.platforms,
    notice: values.notice || null,
    aiImage: values.aiImage,
    maxPlayers: Number(values.maxPlayers),
    minPlayers: values.minPlayers === "" ? null : Number(values.minPlayers),
    recruitMethod: values.recruitMethod,
    // 추첨은 정원과 무관하게 받으므로 대기 접수 설정을 쓰지 않는다.
    waitlistEnabled:
      values.recruitMethod === RECRUIT_METHOD.firstCome ? values.waitlistEnabled : true,
    scheduleMode: values.scheduleMode,
    endDate: fromKstDateTimeInput(values.endDate),
    rangeStart: values.rangeStart || null,
    rangeEnd: values.rangeEnd || null,
    windowStartHour:
      isFixed || !values.windowStartHour
        ? DEFAULT_WINDOW.startHour
        : Number(values.windowStartHour),
    windowEndHour:
      isFixed || !values.windowEndHour ? DEFAULT_WINDOW.endHour : Number(values.windowEndHour),
    // 조율형 세션 시각은 GM이 세션 시간 결정에서 정한다. 폼은 그 값을 건드리지 않는다.
    ...(isFixed && values.confirmedAt
      ? { confirmedAt: fromKstDateTimeInput(values.confirmedAt) }
      : {}),
  };
}
