import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";

// 순위 숫자 뒤에 붙는 단위. 참여 횟수제는 세션 횟수라 「번」, 포인트제는 「점」이다.
export const recordUnit = (mode: RankingMode) => (mode === RANKING_MODE.points ? "점" : "번");
