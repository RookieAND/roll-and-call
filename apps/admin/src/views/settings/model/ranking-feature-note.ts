import { RANKING_MODE_LABEL, type RankingMode } from "@roll-and-call/database/servers/model";

export function rankingFeatureNote(mode: RankingMode) {
  return `[변경 저장]을 누르면 이번 달 순위가 바로 ${RANKING_MODE_LABEL[mode]}로 다시 계산됩니다. 이미 확정한 지난달 순위는 바뀌지 않습니다.`;
}
