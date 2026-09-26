import { setOf } from "./edition-sets";
import type { MyRulebooks } from "./to-my-rulebooks";

// 구인이 가리키는 룰북(판본의 첫 기본 룰북, 예전 구인이면 서플리먼트일 수도)이 속한 판본.
export function ruleSetOf(
  { rulebooks, sets }: Pick<MyRulebooks, "rulebooks" | "sets">,
  rulebookId: string,
) {
  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  return rulebook ? setOf(rulebook, sets) : null;
}
