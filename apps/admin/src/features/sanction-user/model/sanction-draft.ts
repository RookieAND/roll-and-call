import type { SanctionPeriod } from "./sanction-periods";

export interface SanctionDraft {
  period: SanctionPeriod;
  customDays: string;
  reasonCode: string | null;
  otherReason: string;
  staffMemo: string;
  // 기본값(구인 진행·그대로 진행)에서 바꾼 활동. 구인이면 취소, 참여면 빼기다.
  changedSessionIds: string[];
}

export const EMPTY_SANCTION_DRAFT: SanctionDraft = {
  period: "30",
  customDays: "",
  reasonCode: null,
  otherReason: "",
  staffMemo: "",
  changedSessionIds: [],
};
