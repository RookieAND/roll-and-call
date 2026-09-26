import type { RulebookRow } from "./list-rulebooks";

// 카테고리의 책을 판본별로 묶고, 판본마다 GM 조건을 적는다.
// required는 모두 인증해야 하는 기본 룰북, alternatives는 그 판본을 대신하는 신판(하나만 인증해도 된다).
export function categoryEditions(books: RulebookRow[]) {
  const cores = books.filter((book) => book.kind === "core");
  return [...new Set(books.map((book) => book.edition))].map((edition) => {
    const required = cores.filter((book) => book.edition === edition);
    return {
      edition,
      books: books.filter((book) => book.edition === edition),
      required,
      alternatives: cores.filter((book) => book.supersedesEdition === edition),
      free: required.length > 0 && required.every((book) => !book.certRequired),
    };
  });
}

export type CategoryEdition = ReturnType<typeof categoryEditions>[number];
