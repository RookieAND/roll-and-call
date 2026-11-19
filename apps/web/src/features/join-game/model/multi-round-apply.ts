import type { RoundScheduleRound } from "@/entities/game";

// 다회차 구인의 신청 시트가 쓰는 값. 서버가 문구를 만들어 내려 보낸다.
export type MultiRoundApply = {
  // 첫 줄이 「총 6회 · …」 요약이고 회차 일정 시트 맨 위 줄도 이 줄이다.
  summaryLines: string[];
  rounds: RoundScheduleRound[];
};
