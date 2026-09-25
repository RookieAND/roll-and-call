import { RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

// 같은 카테고리·판본의 기본 룰북끼리만 여러 권을 함께 고른다. 다른 책을 누르면 그 책 하나로 바꾼다.
export function toggleSelection(selected: MyRulebook[], rulebook: MyRulebook) {
  if (selected.some((candidate) => candidate.id === rulebook.id)) {
    return selected.filter((candidate) => candidate.id !== rulebook.id);
  }
  const sameSet = (candidate: MyRulebook) =>
    candidate.kind === RULEBOOK_KIND.core &&
    candidate.categoryId === rulebook.categoryId &&
    candidate.edition === rulebook.edition;
  return sameSet(rulebook) && selected.every(sameSet) ? [...selected, rulebook] : [rulebook];
}
