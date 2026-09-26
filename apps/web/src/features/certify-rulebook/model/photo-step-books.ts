import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

import { initialSelection } from "./initial-selection";

// 2단계 주소로 넘어온 책 가운데 지금 낼 수 있는 것. 반려된 책 한 권이면 재신청 화면이다.
export function photoStepBooks(rulebooks: MyRulebook[], rulebookIds: string[]) {
  const ids = initialSelection(rulebooks, rulebookIds);
  const books = ids.flatMap((id) => rulebooks.find((rulebook) => rulebook.id === id) ?? []);
  const [only] = books;
  return { books, retry: books.length === 1 && only!.state === CERT_STATE.rejected };
}
