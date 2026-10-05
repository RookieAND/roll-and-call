// 점수 기준 시트(시안 09 B2)의 표. 값은 packages/database의 점수 함수와 같다.
export const SCORE_RULES = [
  {
    title: "세션",
    value: "100 · 50 · 15점",
    description: "정식 100점, 미니룰 50점, 타이만 15점입니다.",
  },
  {
    title: "GM 가점",
    value: "+20 · +10점",
    description: "참석 플레이어가 3명을 넘으면 1명마다 정식 +20점, 미니룰 +10점입니다.",
  },
  { title: "후기", value: "+10점", description: "공개한 후기 1건마다 더해집니다." },
  { title: "불참", value: "-100점", description: "불참 1건마다 빠집니다." },
] as const;
