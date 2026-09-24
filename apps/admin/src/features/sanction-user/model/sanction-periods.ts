export const SANCTION_PERIODS = [
  { value: "7", label: "7일" },
  { value: "30", label: "30일" },
  { value: "90", label: "90일" },
  { value: "indefinite", label: "무기한" },
  { value: "custom", label: "직접 입력" },
] as const;

export type SanctionPeriod = (typeof SANCTION_PERIODS)[number]["value"];
