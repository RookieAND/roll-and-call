interface CoreCandidate {
  category: string;
  kind: string;
  edition: string;
}

// 서플리먼트가 기대는 기본 룰북. 같은 판본이 있으면 그것만, 없으면 같은 카테고리의 기본 룰북 전부다.
export function supplementCores<Book extends CoreCandidate>(supplement: Book, rulebooks: Book[]) {
  const cores = rulebooks.filter(
    (rulebook) => rulebook.category === supplement.category && rulebook.kind === "core",
  );
  const sameEdition = cores.filter((core) => core.edition === supplement.edition);
  return sameEdition.length > 0 ? sameEdition : cores;
}
