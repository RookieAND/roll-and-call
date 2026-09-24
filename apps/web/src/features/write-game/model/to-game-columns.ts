import { RECRUIT_METHOD } from "@/entities/game";
import { fromKstDateTimeInput, splitPlayTime } from "@/shared/lib";

import type { GameFormValues } from "./game-form";

export function toGameColumns(values: GameFormValues) {
  const { hours, minutes } = splitPlayTime(values.playTime);

  return {
    title: values.title,
    synopsis: values.synopsis || null,
    thumbnailUrl: values.thumbnailUrl || null,
    thumbnailSpoiler: Boolean(values.thumbnailUrl) && values.thumbnailSpoiler,
    images: values.images,
    playTime: values.playTime || null,
    playMinutes: hours * 60 + minutes || null,
    genres: values.genres,
    triggers: values.triggers,
    platforms: values.platforms,
    notice: values.notice || null,
    aiImage: values.aiImage,
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
