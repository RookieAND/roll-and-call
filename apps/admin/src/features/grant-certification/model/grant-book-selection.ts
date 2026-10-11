import { supplementCoresOpened } from "@roll-and-call/database/certifications/model";

import type { GrantOptions } from "@/shared/server";

type GrantBook = GrantOptions["books"][number];

// 서플리먼트는 같은 판본의 기본 룰북을 함께 골라야 고를 수 있다. 서버·유저 상태 계산과 같은 규칙이다(R15).
export function isBookSelectable({
  book,
  books,
  selectedIds,
}: {
  book: GrantBook;
  books: readonly GrantBook[];
  selectedIds: readonly string[];
}) {
  return supplementCoresOpened({ book, books, certifiedIds: new Set(selectedIds) });
}

// 기본 룰북을 뺐을 때 조건을 잃은 서플리먼트를 선택에서 함께 뺀다.
export function pruneBookSelection({
  selectedIds,
  books,
}: {
  selectedIds: readonly string[];
  books: readonly GrantBook[];
}) {
  return selectedIds.filter((id) => {
    const book = books.find((candidate) => candidate.id === id);
    return book ? isBookSelectable({ book, books, selectedIds }) : false;
  });
}
