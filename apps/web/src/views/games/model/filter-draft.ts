import type { GameTimeSlot } from "@/shared/api";

// 필터 시트에서 고르는 중인 값. [N건 보기]를 눌러야 주소에 들어간다.
export interface FilterDraft {
  rules: string[];
  days: number[];
  times: GameTimeSlot[];
  includeUnscheduled: boolean;
}

export const EMPTY_FILTER_DRAFT: FilterDraft = {
  rules: [],
  days: [],
  times: [],
  includeUnscheduled: true,
};
