import type { RuleNotice } from "@/features/reopen-game";

// 지난 구인 다시 열기로 연 위저드. 불러왔으면 원본 제목과 룰 안내를, 못 불러왔으면 실패만 담는다.
export type ReopenContext =
  | { failed?: false; title: string; ruleNotice: RuleNotice | null }
  | { failed: true };
