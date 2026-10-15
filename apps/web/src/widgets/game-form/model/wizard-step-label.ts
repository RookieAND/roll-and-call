import { FORM_SECTION, type SectionKey } from "./game-form-steps";

const STEP_LABEL = {
  [FORM_SECTION.basics]: "게임 정보",
  [FORM_SECTION.preflight]: "참여 전 안내",
  [FORM_SECTION.media]: "이미지",
  [FORM_SECTION.recruit]: "모집 방법",
  [FORM_SECTION.schedule]: "일정",
} as const satisfies Record<SectionKey, string>;

// 우측 진행 패널에 보이는 단계 이름. 한 단계에 구역이 여럿이면 첫 구역 이름을 쓴다.
export function wizardStepLabel(sections: readonly SectionKey[]) {
  return STEP_LABEL[sections[0]!];
}
