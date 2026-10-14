import { supplementCoresOpened } from "@roll-and-call/database/certifications/model";

import { rulebookLabel } from "@/entities/rulebook";

interface BulkBook {
  id: string;
  name: string;
  edition: string;
  kind: string;
  categoryId: string;
  certRequired: boolean;
  supersedesId: string | null;
}

interface BulkBlockedReasonInput {
  rulebookIds: readonly string[];
  books: readonly BulkBook[];
  certifiedIds: ReadonlySet<string>;
  pendingIds: ReadonlySet<string>;
}

// 묶음에서 신청할 수 없는 책을 처음 하나 찾아 이유를 책 이름과 함께 돌려준다. 모두 신청할 수 있으면 null.
// 서플리먼트는 같은 판본 기본 룰북이 인증됐거나 이번 묶음에 함께 들어 있으면 받는다.
export function bulkBlockedReason({
  rulebookIds,
  books,
  certifiedIds,
  pendingIds,
}: BulkBlockedReasonInput): string | null {
  const openedIds = new Set([...certifiedIds, ...rulebookIds]);
  const openable = books.map((book) => ({ ...book, category: book.categoryId }));
  for (const rulebookId of rulebookIds) {
    const book = books.find((candidate) => candidate.id === rulebookId);
    if (!book) return "책을 다시 골라야 합니다.";
    const reason = blockedReason({ book, openable, certifiedIds, pendingIds, openedIds });
    if (reason) return `${rulebookLabel(book)}: ${reason}`;
  }
  return null;
}

interface BlockedReasonInput {
  book: BulkBook;
  openable: Parameters<typeof supplementCoresOpened>[0]["books"];
  certifiedIds: ReadonlySet<string>;
  pendingIds: ReadonlySet<string>;
  openedIds: ReadonlySet<string>;
}

function blockedReason({
  book,
  openable,
  certifiedIds,
  pendingIds,
  openedIds,
}: BlockedReasonInput) {
  if (!book.certRequired) return "인증 없이 구인을 열 수 있는 룰입니다.";
  if (certifiedIds.has(book.id)) return "이미 인증된 룰북입니다.";
  if (pendingIds.has(book.id)) return "심사 중인 신청이 있습니다.";
  const target = openable.find((candidate) => candidate.id === book.id)!;
  const cores = supplementCoresOpened({ book: target, books: openable, certifiedIds: openedIds });
  return cores ? null : "같은 판본의 기본 룰북을 선택해야 합니다.";
}
