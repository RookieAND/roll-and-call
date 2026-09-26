import { isOpened } from "./is-opened";
import { RULEBOOK_KIND } from "./rulebook-kind";
import type { MyRulebook } from "./to-my-rulebooks";

// 카테고리·판본 하나가 GM 세트다. 그 판본의 기본 룰북을 모두 가져야(인증·신판 인증·무료 배포) 그 판본으로 구인을 연다.
export interface EditionSet {
  key: string;
  categoryId: string;
  categoryName: string;
  edition: string;
  label: string;
  cores: MyRulebook[];
  extras: MyRulebook[];
  free: boolean;
  opened: boolean;
  // 무료 배포가 아니라 내가 인증해서 연 세트.
  earned: boolean;
  // 신판 인증으로 열렸으면 그 신판의 판본.
  unlockedBy: string | null;
  // 이 판본 인증으로 함께 열리는 구판들.
  covers: string[];
}

export function editionSetKey(rulebook: Pick<MyRulebook, "categoryId" | "edition">) {
  return `${rulebook.categoryId}:${rulebook.edition}`;
}

// 판본은 새것(큰 숫자)부터. 기본 룰북이 없는 판본(서플리먼트만 있는 판본)은 세트가 아니다.
export function editionSets(rulebooks: MyRulebook[]): EditionSet[] {
  const keys = [
    ...new Set(rulebooks.filter((book) => book.kind === RULEBOOK_KIND.core).map(editionSetKey)),
  ];
  const sets = keys.map((key) => {
    const cores = rulebooks.filter(
      (book) => book.kind === RULEBOOK_KIND.core && editionSetKey(book) === key,
    );
    const [first] = cores as [MyRulebook];
    const opened = cores.every(isOpened);
    const unlocking = cores.find((core) => core.unlockedBy)?.unlockedBy ?? null;
    return {
      key,
      categoryId: first.categoryId,
      categoryName: first.categoryName,
      edition: first.edition,
      label: `${first.categoryName} ${first.edition}`.trim(),
      cores,
      extras: rulebooks.filter(
        (book) => book.kind !== RULEBOOK_KIND.core && editionSetKey(book) === key,
      ),
      free: cores.every((core) => !core.certRequired),
      opened,
      earned: opened && cores.some((core) => core.certRequired),
      unlockedBy: opened && unlocking ? unlocking.edition || unlocking.shortName : null,
      covers: [] as string[],
    };
  });
  for (const set of sets) {
    set.covers = sets
      .filter((older) => older.unlockedBy && older.categoryId === set.categoryId)
      .filter((older) => older.cores.some((core) => set.cores.includes(core.unlockedBy!)))
      .map((older) => older.edition);
  }
  return sets.toSorted(
    (left, right) =>
      left.categoryName.localeCompare(right.categoryName, "ko") ||
      right.edition.localeCompare(left.edition, "ko", { numeric: true }),
  );
}

// 책이 속한 세트. 서플리먼트·핸드북은 같은 판본의 세트, 없으면 null.
export function setOf(rulebook: MyRulebook, sets: EditionSet[]) {
  return sets.find((set) => set.key === editionSetKey(rulebook)) ?? null;
}
