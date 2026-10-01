import { RULEBOOK_KIND } from "./rulebook-kind";
import type { MyRulebook } from "./to-my-rulebooks";

// 서플리먼트 판본에 맞는 기본 룰북이 없으면 카테고리의 기본 룰북 전부를 본다.
export function setCores(rulebook: MyRulebook, rulebooks: MyRulebook[]) {
  const cores = rulebooks.filter(
    (candidate) =>
      candidate.categoryId === rulebook.categoryId && candidate.kind === RULEBOOK_KIND.core,
  );
  const sameEdition = cores.filter((core) => core.edition === rulebook.edition);
  return sameEdition.length > 0 ? sameEdition : cores;
}
