import { RULEBOOK_KIND } from "./rulebook-kind";
import type { MyRulebook } from "./to-my-rulebooks";

// 카테고리·판본 하나가 GM 세트다. 그 판본의 기본 룰북을 모두 가져야 GM을 연다.
// 서플리먼트 판본에 맞는 기본 룰북이 없으면 카테고리의 기본 룰북 전부를 본다.
export function setCores(rulebook: MyRulebook, rulebooks: MyRulebook[]) {
  const cores = rulebooks.filter(
    (candidate) =>
      candidate.categoryId === rulebook.categoryId && candidate.kind === RULEBOOK_KIND.core,
  );
  const sameEdition = cores.filter((core) => core.edition === rulebook.edition);
  return sameEdition.length > 0 ? sameEdition : cores;
}
