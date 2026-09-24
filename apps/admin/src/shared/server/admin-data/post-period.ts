// 구인 목록의 세션 일시 필터. 기준일 이후(앞으로 열릴 세션 포함)만 남긴다.
export const POST_PERIODS = [{ value: "4w", label: "세션 일시 · 최근 4주", days: 28 }] as const;
