// 운영진이 불참 기록을 추가한 까닭. 값은 participants_absence_added_tag check와 같다.
export const ABSENCE_ADDED_TAG = {
  gmRequest: "gm_request",
  memberConfirmed: "member_confirmed",
  other: "other",
} as const;

export type AbsenceAddedTag = (typeof ABSENCE_ADDED_TAG)[keyof typeof ABSENCE_ADDED_TAG];

export const ABSENCE_ADDED_TAG_LABEL = {
  [ABSENCE_ADDED_TAG.gmRequest]: "GM 정정 요청",
  [ABSENCE_ADDED_TAG.memberConfirmed]: "당사자 확인",
  [ABSENCE_ADDED_TAG.other]: "기타",
} as const satisfies Record<AbsenceAddedTag, string>;
