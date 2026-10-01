import type { Rulebook } from "./types";

// 사용자 앱(entities/rulebook setCores)과 같은 규칙이다.
export function supplementCores(supplement: Rulebook, rulebooks: Rulebook[]) {
  const cores = rulebooks.filter(
    (rulebook) => rulebook.category === supplement.category && rulebook.kind === "core",
  );
  const sameEdition = cores.filter((core) => core.edition === supplement.edition);
  return sameEdition.length > 0 ? sameEdition : cores;
}
