import { RULEBOOK_KIND } from "#/modules/rulebooks/model/rulebook-kind";

interface OpenableBook {
  id: string;
  kind: string;
  // 카테고리를 가르는 값(카테고리 ID나 서버 안에서 겹치지 않는 이름).
  category: string;
  edition: string;
  certRequired: boolean;
  supersedesId: string | null;
}

// 서플리먼트는 같은 판본의 기본 룰북을 모두 연(인증·신판 인증·인증 불필요) 사람만 인증할 수 있다.
// 사용자 앱 인증 신청(submit-certification)과 같은 규칙이다. books에는 숨기지 않은 책만 넘긴다.
export function supplementCoresOpened({
  book,
  books,
  certifiedIds,
}: {
  book: OpenableBook;
  books: readonly OpenableBook[];
  certifiedIds: ReadonlySet<string>;
}) {
  if (book.kind !== RULEBOOK_KIND.supplement) return true;
  const opened = (core: OpenableBook) =>
    !core.certRequired ||
    certifiedIds.has(core.id) ||
    books.some((newer) => newer.supersedesId === core.id && certifiedIds.has(newer.id));
  return books
    .filter(
      (candidate) =>
        candidate.kind === RULEBOOK_KIND.core &&
        candidate.category === book.category &&
        candidate.edition === book.edition,
    )
    .every(opened);
}
