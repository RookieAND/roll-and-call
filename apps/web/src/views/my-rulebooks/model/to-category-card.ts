import {
  CERT_OPTION,
  CERT_STATE,
  certOption,
  certRowMeta,
  groupByCategory,
  isOpened,
  RULEBOOK_KIND,
  type MyRulebook,
} from "@/entities/rulebook";

import { BOOK_ROW, type BookRow, type CategoryCard } from "./book-row";
import { bookTitle } from "./book-title";
const STATE_ROW = {
  [CERT_STATE.certified]: BOOK_ROW.certified,
  [CERT_STATE.pending]: BOOK_ROW.pending,
  [CERT_STATE.rejected]: BOOK_ROW.rejected,
  [CERT_STATE.revoked]: BOOK_ROW.revoked,
} as const;

type Category = ReturnType<typeof groupByCategory>[number];

// 카테고리 하나를 카드로. 판본마다 기본 룰북을 모두 가졌는지로 GM 가능을 가린다.
export function toCategoryCard({
  id,
  name,
  editions,
  rulebooks: books,
}: Category): CategoryCard | null {
  const tracked = books.filter((rulebook) => rulebook.state !== null || rulebook.unlockedBy);
  if (tracked.length === 0) return null;

  const coresOf = (edition: string) =>
    books.filter(
      (rulebook) => rulebook.edition === edition && rulebook.kind === RULEBOOK_KIND.core,
    );
  // 무료 배포 책만으로 열린 판본은 내가 인증한 세트가 아니다.
  const earned = (rulebook: MyRulebook) => rulebook.certRequired && isOpened(rulebook);
  const readyEditions = editions
    .map(({ edition }) => edition)
    .filter((edition) => {
      const cores = coresOf(edition);
      return cores.length > 0 && cores.every(isOpened) && cores.some(earned);
    });
  const missing = editions.flatMap(({ edition }) => {
    const cores = coresOf(edition);
    return cores.some(earned) && !readyEditions.includes(edition)
      ? cores.filter((core) => !isOpened(core))
      : [];
  });
  const gmReady = readyEditions.length > 0;

  const rows = books.flatMap((rulebook): BookRow[] => {
    if (rulebook.state && rulebook.state !== CERT_STATE.requested) {
      return [{ rulebook, type: STATE_ROW[rulebook.state], meta: certRowMeta(rulebook) }];
    }
    if (rulebook.unlockedBy) {
      return [{ rulebook, type: BOOK_ROW.unlocked, meta: certOption(rulebook, books).note }];
    }
    if (missing.includes(rulebook)) {
      return [{ rulebook, type: BOOK_ROW.missing, meta: "아직 인증하지 않았습니다" }];
    }
    const addable =
      gmReady &&
      rulebook.kind === RULEBOOK_KIND.supplement &&
      readyEditions.includes(rulebook.edition) &&
      certOption(rulebook, books).type === CERT_OPTION.pick;
    return addable ? [{ rulebook, type: BOOK_ROW.add, meta: "추가 인증 가능" }] : [];
  });

  const has = (state: string) => tracked.some((rulebook) => rulebook.state === state);
  const applicable = missing.filter((core) => certOption(core, books).type === CERT_OPTION.pick);
  const [onlyApplicable] = applicable;
  const badge: CategoryCard["badge"] = gmReady
    ? { label: "GM 가능", palette: "success" }
    : missing.length > 0
      ? { label: `${missing.length}권 더 필요`, palette: "gray" }
      : has(CERT_STATE.pending)
        ? { label: "확인 중", palette: "gray" }
        : has(CERT_STATE.rejected)
          ? { label: "반려됨", palette: "warning" }
          : has(CERT_STATE.certified)
            ? { label: "인증됨", palette: "success" }
            : { label: "인증 취소됨", palette: "gray" };

  return {
    id,
    name,
    badge,
    summary: gmReady ? `${readyEditions.filter(Boolean).join("·")} GM 가능`.trim() : "",
    cta:
      onlyApplicable && !gmReady
        ? {
            text: `${missing.map(bookTitle).join(", ")} 인증을 받으면 GM을 열 수 있습니다.`,
            button:
              applicable.length === 1
                ? `${onlyApplicable.shortName} 신청`
                : `${applicable.length}권 신청`,
            rulebookIds: applicable.map((core) => core.id),
          }
        : null,
    rows,
    gmReady,
    rejected: has(CERT_STATE.rejected),
    at: new Date(Math.max(...tracked.map((rulebook) => rulebook.stateAt?.getTime() ?? 0))),
  };
}
