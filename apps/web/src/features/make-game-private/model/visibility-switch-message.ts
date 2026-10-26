import { VISIBILITY_SWITCH_BLOCK, type VisibilitySwitchBlock } from "@/entities/game";

export const VISIBILITY_SWITCH_MESSAGE = {
  [VISIBILITY_SWITCH_BLOCK.cancelled]: "취소된 구인은 모집 유형을 바꿀 수 없습니다.",
  [VISIBILITY_SWITCH_BLOCK.started]: "세션이 시작된 뒤에는 모집 유형을 바꿀 수 없습니다.",
  [VISIBILITY_SWITCH_BLOCK.hasApplicants]: "신청자가 있어 모집 유형을 바꿀 수 없습니다.",
  [VISIBILITY_SWITCH_BLOCK.coordinate]: "일정 조율형 구인은 지정 모집으로 바꿀 수 없습니다.",
} as const satisfies Record<VisibilitySwitchBlock, string>;
