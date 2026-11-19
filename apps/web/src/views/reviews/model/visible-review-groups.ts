// 묶음이 이 개수를 넘으면 나머지를 「지난 회차 후기 n개」로 접는다.
const VISIBLE_GROUPS = 3;

export function visibleReviewGroups<Group>(groups: readonly Group[]) {
  return { shown: groups.slice(0, VISIBLE_GROUPS), folded: groups.slice(VISIBLE_GROUPS) };
}
