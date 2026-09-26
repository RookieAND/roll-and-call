import { editionSetKey, RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

import { togglePick } from "./toggle-pick";

// 주소로 넘어온 책 가운데 첫 책의 판본에 속하고 지금 고를 수 있는 것만, 차례로 누른 것처럼 담는다.
export function initialSelection(rulebooks: MyRulebook[], rulebookIds: string[]) {
  const books = rulebookIds.flatMap((id) => rulebooks.find((rulebook) => rulebook.id === id) ?? []);
  const [first] = books;
  if (!first) return [];
  const sameSet = books.filter((book) => editionSetKey(book) === editionSetKey(first));
  const cores = sameSet.filter((book) => book.kind === RULEBOOK_KIND.core);
  const ordered = [...cores, ...sameSet.filter((book) => !cores.includes(book))];
  return ordered.reduce<string[]>(
    (selected, book) =>
      selected.includes(book.id) ? selected : togglePick(selected, book.id, rulebooks),
    [],
  );
}
