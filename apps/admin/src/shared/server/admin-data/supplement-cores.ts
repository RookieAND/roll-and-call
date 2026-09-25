import type { Rulebook } from "./types";

// 서플리먼트가 기대는 기본 룰북: 같은 카테고리·판본의 기본 룰북, 판본이 맞는 게 없으면 카테고리의 기본 룰북 전부.
// 사용자 앱(entities/rulebook setCores)과 같은 규칙이다.
export function supplementCores(supplement: Rulebook, rulebooks: Rulebook[]) {
  const cores = rulebooks.filter(
    (rulebook) => rulebook.category === supplement.category && rulebook.kind === "core",
  );
  const sameEdition = cores.filter((core) => core.edition === supplement.edition);
  return sameEdition.length > 0 ? sameEdition : cores;
}
