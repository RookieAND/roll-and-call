export const REPORT_REASON = {
  abuse: "abuse",
  privacy: "privacy",
  spoiler: "spoiler",
  image: "image",
  unrelated: "unrelated",
  other: "other",
} as const;

export type ReportReason = (typeof REPORT_REASON)[keyof typeof REPORT_REASON];

export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  [REPORT_REASON.abuse]: "욕설·비방",
  [REPORT_REASON.privacy]: "개인정보 노출",
  [REPORT_REASON.spoiler]: "스포일러 미표시",
  [REPORT_REASON.image]: "부적절한 이미지",
  [REPORT_REASON.unrelated]: "세션과 무관한 내용",
  [REPORT_REASON.other]: "기타",
};
