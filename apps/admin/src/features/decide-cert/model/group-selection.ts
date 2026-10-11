import type { GroupBook } from "./group-book";

interface GroupSelectionInput {
  books: GroupBook[];
  uncheckedIds: string[];
}

export function pendingGroupBooks(books: GroupBook[]) {
  return books.filter((book) => book.status === "pending");
}

// 체크한 책은 승인하고, 체크하지 않은 책은 반려한다.
export function groupApproveIds({ books, uncheckedIds }: GroupSelectionInput) {
  return pendingGroupBooks(books)
    .filter((book) => !uncheckedIds.includes(book.applicationId))
    .map((book) => book.applicationId);
}

export function groupRejectIds({ books, uncheckedIds }: GroupSelectionInput) {
  return pendingGroupBooks(books)
    .filter((book) => uncheckedIds.includes(book.applicationId))
    .map((book) => book.applicationId);
}
