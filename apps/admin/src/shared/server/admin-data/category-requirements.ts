import { rulebookLabel } from "./rulebook-label";
import type { Rulebook } from "./types";

export interface CategoryRequirement {
  label: string;
  requirement: string;
  hosting: boolean;
}

type RequirementBook = Pick<
  Rulebook,
  "id" | "name" | "edition" | "kind" | "supersedesId" | "certRequired"
>;

// 판본마다 GM이 되려면 인증해야 하는 기본 룰북과, 그 판본을 대신하는 신판을 적는다. 서플리먼트는 같은 판본의 기본 룰북 인증이 먼저다.
export function categoryRequirements(books: RequirementBook[]): CategoryRequirement[] {
  const cores = books.filter((book) => book.kind === "core");
  const editions = [...new Set(cores.map((book) => book.edition))];
  const hosting = editions.map((edition) => {
    const needed = cores.filter((book) => book.edition === edition);
    const neededIds = new Set(needed.map((book) => book.id));
    const newer = cores.filter((book) => book.supersedesId && neededIds.has(book.supersedesId));
    const all = needed.map(rulebookLabel).join(", ") + (needed.length > 1 ? " 모두" : "");
    const alternative = newer.length > 0 ? ` 또는 ${newer.map(rulebookLabel).join(", ")}` : "";
    const free = needed.every((book) => !book.certRequired) ? " (인증 불필요)" : "";
    return {
      label: edition ? `${edition} 구인` : "구인",
      requirement: all + alternative + free,
      hosting: true,
    };
  });
  const supplementEditions = [
    ...new Set(books.filter((book) => book.kind === "supplement").map((book) => book.edition)),
  ];
  const supplements = supplementEditions.map((edition) => ({
    label: edition ? `${edition} 서플리먼트` : "서플리먼트",
    requirement: `${edition ? `${edition} ` : ""}기본 룰북 인증 필요`,
    hosting: false,
  }));
  return [...hosting, ...supplements];
}
