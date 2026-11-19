import type { RoundRowView } from "./round-row";
import { ROUND_ROW_KIND } from "./round-row-kind";

// 끝난 회차가 이 개수를 넘으면 앞쪽을 「지난 회차 n개」로 접는다.
const VISIBLE_FINISHED = 4;

// 접을 지난 회차와 늘 보이는 회차로 나눈다.
export function visibleRoundRows(views: readonly RoundRowView[]) {
  const finished = views.filter((view) => view.kind === ROUND_ROW_KIND.finished);
  const foldCount = Math.max(finished.length - VISIBLE_FINISHED, 0);
  const folded = new Set(finished.slice(0, foldCount).map((view) => view.key));
  return {
    folded: views.filter((view) => folded.has(view.key)),
    shown: views.filter((view) => !folded.has(view.key)),
  };
}
