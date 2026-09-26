import { RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

// 기본 룰북 묶음 머리글 아래 한 줄. 판본이 하나면 권수를, 여럿이면 판본마다 따로 GM이 된다는 걸 적는다.
export function coreNeedNote(books: MyRulebook[]) {
  const cores = books.filter((book) => book.kind === RULEBOOK_KIND.core && book.certRequired);
  if (cores.length === 0) return "";
  const editions = new Set(cores.map((core) => core.edition));
  if (editions.size === 1) {
    return cores.length > 1 ? `GM이 되려면 기본 룰북 ${cores.length}권이 모두 필요합니다.` : "";
  }
  return "한 판본의 기본 룰북만 인증하면 됩니다.";
}
