import { RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

// 기본 룰북 묶음 머리글 아래 한 줄. 판본이 하나면 권수를, 여럿이면 판본 규칙을 적는다.
export function coreNeedNote(books: MyRulebook[]) {
  const cores = books.filter((book) => book.kind === RULEBOOK_KIND.core && book.certRequired);
  if (cores.length === 0) return "";
  const editions = new Set(cores.map((core) => core.edition));
  return editions.size === 1 && cores.length > 1
    ? `GM이 되려면 기본 룰북 ${cores.length}권이 모두 필요합니다.`
    : "GM이 되려면 같은 판본의 기본 룰북을 모두 인증해야 합니다.";
}
