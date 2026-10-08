import { GAME_TAG } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

export type SectionKey = "basics" | "preflight" | "media" | "recruit" | "schedule";

export const FORM_SECTION = {
  basics: "basics",
  preflight: "preflight",
  media: "media",
  recruit: "recruit",
  schedule: "schedule",
} as const satisfies Record<SectionKey, SectionKey>;

export type WizardStepConfig = {
  title?: string;
  description?: string;
  sections: readonly SectionKey[];
};

export const SECTION_FIELDS = {
  [FORM_SECTION.basics]: ["title", "kind", "playType", "rule", "playMinutes", "synopsis"],
  [FORM_SECTION.preflight]: [
    GAME_TAG.genres,
    GAME_TAG.triggers,
    GAME_TAG.platforms,
    "aiImage",
    "notice",
  ],
  [FORM_SECTION.media]: ["thumbnailUrl", "thumbnailSpoiler", "images"],
  [FORM_SECTION.recruit]: [
    "maxPlayers",
    "minPlayers",
    "preConfirmed",
    "recruitMethod",
    "waitlistEnabled",
  ],
  [FORM_SECTION.schedule]: [
    "scheduleMode",
    "confirmedAt",
    "rangeStart",
    "rangeEnd",
    "windowStartHour",
    "windowEndHour",
    "endDate",
  ],
} as const satisfies Record<SectionKey, readonly (keyof GameFormValues)[]>;

export const GAME_FORM_STEPS = [
  {
    title: "구인 정보",
    description: "어떤 세션을 얼마나 하는지 알려 주세요.",
    sections: [FORM_SECTION.basics],
  },
  {
    title: "참여 전 안내",
    description: "신청하기 전에 알아야 할 내용입니다. 모두 선택입니다.",
    sections: [FORM_SECTION.preflight],
  },
  {
    title: "이미지",
    description: "구인글에 보여 줄 그림입니다. 나중에 올려도 됩니다.",
    sections: [FORM_SECTION.media],
  },
  {
    title: "모집 방법",
    description: "몇 명을 어떤 방식으로 받을지 정합니다.",
    sections: [FORM_SECTION.recruit],
  },
  {
    title: "일정",
    description: "언제 모일지와 언제까지 신청받을지 정합니다.",
    sections: [FORM_SECTION.schedule],
  },
] as const satisfies readonly WizardStepConfig[];
