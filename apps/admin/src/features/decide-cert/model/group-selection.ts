import type { GroupBook } from "./group-book";

interface GroupSelectionInput {
  books: GroupBook[];
  rejectedIds: string[];
}

export function pendingGroupBooks(books: GroupBook[]) {
  return books.filter((book) => book.status === "pending");
}

// 기본은 모두 승인이고, 운영진이 반려로 바꾼 책만 반려한다.
export function groupApproveIds({ books, rejectedIds }: GroupSelectionInput) {
  return pendingGroupBooks(books)
    .filter((book) => !rejectedIds.includes(book.applicationId))
    .map((book) => book.applicationId);
}

export function groupRejectIds({ books, rejectedIds }: GroupSelectionInput) {
  return pendingGroupBooks(books)
    .filter((book) => rejectedIds.includes(book.applicationId))
    .map((book) => book.applicationId);
}
