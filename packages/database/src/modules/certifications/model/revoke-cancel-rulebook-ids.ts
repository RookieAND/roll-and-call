import { RULEBOOK_KIND } from "#/modules/rulebooks/model/rulebook-kind";

interface EditionBook {
  id: string;
  kind: string;
  categoryId: string | null;
  edition: string;
}

// 구인은 판본의 첫 기본 룰북을 가리킨다(games.rulebook_id). 기본 룰북 하나를 잃으면 그 판본 구인을 열 수 없으므로
// 같은 판본의 기본 룰북을 가리키는 구인이 모두 대상이다. 서플리먼트·플레이어 책은 구인 자격과 무관해 대상이 없다.
export function revokeCancelRulebookIds({
  rulebook,
  rulebooks,
}: {
  rulebook: EditionBook;
  rulebooks: readonly EditionBook[];
}): string[] {
  if (rulebook.kind !== RULEBOOK_KIND.core) return [];
  return rulebooks
    .filter(
      (candidate) =>
        candidate.kind === RULEBOOK_KIND.core &&
        candidate.categoryId === rulebook.categoryId &&
        candidate.edition === rulebook.edition,
    )
    .map((candidate) => candidate.id);
}
