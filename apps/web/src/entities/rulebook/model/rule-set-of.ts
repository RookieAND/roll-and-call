import { uniqBy } from "es-toolkit";

import { setOf } from "./edition-sets";
import type { MyRulebooks } from "./to-my-rulebooks";

// 구인이 가리키는 룰북(판본의 첫 기본 룰북, 예전 구인이면 서플리먼트일 수도)이 속한 판본.
export function ruleSetOf({
  myRulebooks,
  rulebookId,
}: {
  myRulebooks: Pick<MyRulebooks, "rulebooks" | "sets">;
  rulebookId: string;
}) {
  const { rulebooks, sets } = myRulebooks;
  const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
  const set = rulebook ? setOf({ rulebook, sets }) : null;
  if (!set) return null;
  // 이 판본의 기본 룰북이 포함하는 서플리먼트(구판 시절 서플리먼트)도 목록에 든다. 같은 책은 한 번만 둔다.
  const coreIds = new Set(set.cores.map((core) => core.id));
  const included = rulebooks.filter((book) => book.includedInId && coreIds.has(book.includedInId));
  return { ...set, extras: uniqBy([...set.extras, ...included], (book) => book.id) };
}
