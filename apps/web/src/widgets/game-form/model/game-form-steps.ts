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
  [FORM_SECTION.basics]: ["title", "rule", "playTime", "synopsis"],
  [FORM_SECTION.preflight]: [
    GAME_TAG.genres,
    GAME_TAG.triggers,
    GAME_TAG.platforms,
    "aiImage",
    "notice",
  ],
  [FORM_SECTION.media]: ["thumbnailUrl", "thumbnailSpoiler", "images"],
  [FORM_SECTION.recruit]: ["maxPlayers", "preConfirmed", "recruitMethod", "waitlistEnabled"],
  [FORM_SECTION.schedule]: ["scheduleMode", "confirmedAt", "rangeStart", "rangeEnd", "endDate"],
} as const satisfies Record<SectionKey, readonly (keyof GameFormValues)[]>;

// 등록은 한 단계에서 한 종류의 결정만 한다.
export const CREATE_STEPS = [
  {
    title: "게임",
    description: "무엇을 하는 게임인지 적습니다.",
    sections: [FORM_SECTION.basics],
  },
  {
    title: "참여 전 안내",
    description: "참여자가 신청하기 전에 알아야 할 것들입니다. 모두 선택입니다.",
    sections: [FORM_SECTION.preflight],
  },
  {
    title: "이미지",
    description: "없어도 등록할 수 있습니다. 나중에 수정에서 추가해도 됩니다.",
    sections: [FORM_SECTION.media],
  },
  {
    title: "모집",
    description: "몇 명을 어떻게 뽑을지 정합니다.",
    sections: [FORM_SECTION.recruit],
  },
  {
    title: "일정",
    description: "언제 모이고, 언제까지 받을지 정합니다.",
    sections: [FORM_SECTION.schedule],
  },
] as const satisfies readonly WizardStepConfig[];

// 수정도 등록과 같은 5단계다. 이미지 단계만 "나중에 추가" 안내가 맞지 않아 설명을 바꾼다.
export const EDIT_STEPS = [
  CREATE_STEPS[0],
  CREATE_STEPS[1],
  { ...CREATE_STEPS[2], description: "목록과 상세에 보이는 그림입니다." },
  CREATE_STEPS[3],
  CREATE_STEPS[4],
] as const satisfies readonly WizardStepConfig[];
