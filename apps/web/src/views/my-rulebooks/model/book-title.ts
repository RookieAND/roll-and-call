import type { MyRulebook } from "@/entities/rulebook";

// 카테고리 카드 안의 한 줄 제목. 카테고리 이름을 빼고 판본은 붙인다.
export function bookTitle(rulebook: MyRulebook) {
  return `${rulebook.shortName} ${rulebook.edition}`.trim();
}
