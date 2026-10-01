import { uniq } from "es-toolkit";

import { RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

export function coreNeedNote(books: MyRulebook[]) {
  const cores = books.filter((book) => book.kind === RULEBOOK_KIND.core && book.certRequired);
  if (cores.length === 0) return "";
  const editions = uniq(cores.map((core) => core.edition));
  if (editions.length === 1) {
    return cores.length > 1 ? `GM이 되려면 기본 룰북 ${cores.length}권이 모두 필요합니다.` : "";
  }
  return "한 판본의 기본 룰북만 인증하면 됩니다.";
}
