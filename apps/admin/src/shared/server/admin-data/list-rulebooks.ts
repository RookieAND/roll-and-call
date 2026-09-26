import "server-only";
import { rulebookKind, type RulebookKind } from "@roll-and-call/database";

import { rulebookLabel } from "./rulebook-label";
import { loadSnapshot } from "./snapshot";

export interface RulebookRow {
  id: string;
  name: string;
  label: string;
  edition: string;
  category: string;
  kind: RulebookKind;
  supersedesEdition?: string;
  aliases: string[];
  certRequired: boolean;
  hidden: boolean;
  certifiedCount: number;
}

export interface RulebookCategory {
  name: string;
  bookCount: number;
}

// 카테고리끼리 모으고, 그 안에서는 기본 룰북 → 서플리먼트 → 핸드북 순이다. 검색어는 이름·판본·카테고리·다른 이름에서 부분 일치로 찾는다.
export async function listRulebooks({ query }: { query?: string } = {}) {
  const db = await loadSnapshot();
  const rows: RulebookRow[] = db.rulebooks
    .map((rulebook) => {
      const label = rulebookLabel(rulebook);
      return {
        id: rulebook.id,
        name: rulebook.name,
        label,
        edition: rulebook.edition,
        category: rulebook.category,
        kind: rulebook.kind,
        supersedesEdition: db.rulebooks.find((old) => old.id === rulebook.supersedesId)?.edition,
        aliases: rulebook.aliases,
        certRequired: rulebook.certRequired,
        hidden: rulebook.hidden,
        certifiedCount: db.certifications.filter((item) => item.rulebook === label).length,
      };
    })
    .toSorted(
      (a, b) =>
        a.category.localeCompare(b.category, "ko") ||
        rulebookKind.enumValues.indexOf(a.kind) - rulebookKind.enumValues.indexOf(b.kind) ||
        a.label.localeCompare(b.label, "ko"),
    );
  const categories: RulebookCategory[] = [...new Set(rows.map((row) => row.category))].map(
    (name) => ({
      name,
      bookCount: db.rulebooks.filter((rulebook) => rulebook.category === name).length,
    }),
  );
  const keyword = query?.trim().toLowerCase();
  const matches = (row: RulebookRow) =>
    [row.label, row.category, ...row.aliases].some((text) => text.toLowerCase().includes(keyword!));
  // 숨기지 않은 책은 있는데 기본 룰북이 하나도 없는 판본. 사용자 앱은 이 판본의 구인을 누구나 열게 둔다.
  const visible = db.rulebooks.filter((rulebook) => !rulebook.hidden);
  const editionsWithoutCore = [
    ...new Set(
      visible
        .filter(
          (book) =>
            !visible.some(
              (other) =>
                other.kind === "core" &&
                other.category === book.category &&
                other.edition === book.edition,
            ),
        )
        .map((book) => `${book.category} ${book.edition}`.trim()),
    ),
  ];
  return {
    total: rows.length,
    rows: keyword ? rows.filter(matches) : rows,
    categories,
    editionsWithoutCore,
  };
}
