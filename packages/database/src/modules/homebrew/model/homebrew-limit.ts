// 자작 룰 신청 입력 한도. DB check와 신청 검증이 같은 값을 쓴다.
export const HOMEBREW_LIMIT = {
  nameLength: 40,
  summaryLength: 100,
  descriptionLength: 2000,
  rejectReasonLength: 200,
  links: 3,
  images: 10,
  pendingPerUser: 3,
} as const;
