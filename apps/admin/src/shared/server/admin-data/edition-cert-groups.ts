import type { Rulebook } from "./types";

// 인증이 필요한 판본("카테고리 판본")마다 GM 자격 조건. 그 판본의 기본 룰북을 모두 인증했거나,
// 그 판본을 포함하는 신판 기본 룰북을 하나라도 인증했으면 GM이 될 수 있다. 숨긴 책은 뺀다.
export function editionCertGroups(rulebooks: Rulebook[]) {
  const cores = rulebooks.filter((rulebook) => rulebook.kind === "core" && !rulebook.hidden);
  const keys = [
    ...new Map(
      cores.map((core) => [`${core.category}\u0000${core.edition}`, core] as const),
    ).values(),
  ];
  return keys
    .map(({ category, edition }) => {
      const books = rulebooks.filter(
        (rulebook) => rulebook.category === category && rulebook.edition === edition,
      );
      const required = cores.filter((core) => books.includes(core));
      const bookIds = new Set(books.map((book) => book.id));
      const coverIds = cores
        .filter((core) => core.supersedesId !== null && bookIds.has(core.supersedesId))
        .map((core) => core.id);
      const certified = (certifiedIds: Set<string>) =>
        required.every((core) => certifiedIds.has(core.id));
      return {
        label: `${category} ${edition}`.trim(),
        bookIds,
        certRequired: required.some((core) => core.certRequired),
        // 이 판본의 기본 룰북을 직접 모두 인증했는지. 신판 인증으로 열린 구판은 빠진다.
        certified,
        eligible: (certifiedIds: Set<string>) =>
          certified(certifiedIds) || coverIds.some((id) => certifiedIds.has(id)),
      };
    })
    .filter((group) => group.certRequired);
}
