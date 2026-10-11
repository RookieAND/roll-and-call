import {
  GRANT_SKIP_REASON,
  type GrantSkipReason,
} from "@roll-and-call/database/certifications/model";
import { compact, uniq } from "es-toolkit";

interface GrantBookOutcome {
  rulebookLabel: string;
  granted: { nickname: string }[];
  skipped: { nickname: string; reason: GrantSkipReason }[];
}

const namesOf = (rows: { nickname: string }[]) => uniq(rows.map((row) => row.nickname)).join(", ");

// 그사이 이미 인증된 사람·기본 룰북이 빠진 사람은 빼고 부여한 뒤 그 사람을 덧붙인다.
// 룰북을 여러 권 골랐으면 어느 룰북에서 빠졌는지 줄마다 밝힌다.
export function grantResultToast({ books }: { books: GrantBookOutcome[] }) {
  const several = books.length > 1;
  const reasonOf = (book: GrantBookOutcome, reason: GrantSkipReason) =>
    book.skipped.filter((row) => row.reason === reason);
  const withLabel = (book: GrantBookOutcome, text: string) =>
    several ? `${book.rulebookLabel}: ${text}` : text;
  const notes = books.flatMap((book) => {
    const already = reasonOf(book, GRANT_SKIP_REASON.alreadyCertified);
    const blocked = reasonOf(book, GRANT_SKIP_REASON.supplementBlocked);
    return compact([
      already.length > 0
        ? withLabel(book, `${namesOf(already)}님은 이미 인증되어 빼고 부여했습니다`)
        : null,
      blocked.length > 0
        ? withLabel(book, `${namesOf(blocked)}님은 기본 룰북 인증이 먼저 필요합니다`)
        : null,
    ]);
  });
  const grantedBooks = books.filter((book) => book.granted.length > 0);
  if (grantedBooks.length === 0) {
    const skipped = books.flatMap((book) => book.skipped);
    const blocked = skipped.filter((row) => row.reason === GRANT_SKIP_REASON.supplementBlocked);
    return {
      success: false,
      title:
        blocked.length > 0
          ? "기본 룰북 인증이 먼저 필요합니다"
          : `${namesOf(skipped)}님은 이미 인증되었습니다`,
      description: undefined,
    };
  }
  const people = uniq(grantedBooks.flatMap((book) => book.granted.map((row) => row.nickname)));
  const [firstBook] = grantedBooks;
  return {
    success: true,
    title:
      grantedBooks.length === 1 && firstBook
        ? `${firstBook.granted.length}명에게 ${firstBook.rulebookLabel} 인증을 부여했습니다`
        : `${people.length}명에게 룰북 ${grantedBooks.length}권의 인증을 부여했습니다`,
    description: notes.length > 0 ? notes.join("\n") : undefined,
  };
}
