import type { SanctionPeriod } from "./sanction-periods";

export interface SanctionDraft {
  period: SanctionPeriod;
  customDays: string;
  userReason: string;
  staffMemo: string;
  leftSessionIds: string[];
}

export const EMPTY_SANCTION_DRAFT: SanctionDraft = {
  period: "30",
  customDays: "",
  userReason: "",
  staffMemo: "",
  leftSessionIds: [],
};
