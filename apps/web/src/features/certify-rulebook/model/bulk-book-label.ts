import type { MyRulebook } from "@/entities/rulebook";

// 제목에 판본 이름이 이미 들어 있으면 판본을 다시 붙이지 않는다.
export function bulkBookLabel(book: MyRulebook) {
  const includesEdition = book.edition === "" || book.shortName.includes(book.edition);
  return includesEdition ? book.shortName : `${book.shortName} ${book.edition}`;
}
