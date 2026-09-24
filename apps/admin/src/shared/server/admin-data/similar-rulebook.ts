import { rulebookLabel } from "./rulebook-label";
import type { Rulebook } from "./types";

// 요청한 이름이 이미 있는 룰북의 이름·다른 이름과 겹치면 연결 후보로 보여 준다.
export function similarRulebook(name: string, list: Rulebook[]) {
  const needle = name.trim().toLowerCase();
  const match = list.find((rulebook) =>
    [rulebookLabel(rulebook), rulebook.name, ...rulebook.aliases].some((text) => {
      const hay = text.toLowerCase();
      return hay.includes(needle) || needle.includes(hay);
    }),
  );
  return match ? rulebookLabel(match) : undefined;
}
