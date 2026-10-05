import "server-only";
import type { RulebookKind } from "@roll-and-call/database";
import { RULEBOOK_KINDS, rulebookLabel } from "@roll-and-call/database/rulebooks";
import { uniq } from "es-toolkit";

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
  miniRule: boolean;
  hidden: boolean;
  certifiedCount: number;
}

export interface RulebookCategory {
  name: string;
  bookCount: number;
}

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
        miniRule: rulebook.miniRule,
        hidden: rulebook.hidden,
        certifiedCount: db.certifications.filter((item) => item.rulebook === label).length,
      };
    })
    .toSorted(
      (a, b) =>
        a.category.localeCompare(b.category, "ko") ||
        RULEBOOK_KINDS.indexOf(a.kind) - RULEBOOK_KINDS.indexOf(b.kind) ||
        a.label.localeCompare(b.label, "ko"),
    );
  const categories: RulebookCategory[] = uniq(rows.map((row) => row.category)).map((name) => ({
    name,
    bookCount: db.rulebooks.filter((rulebook) => rulebook.category === name).length,
  }));
  const keyword = query?.trim().toLowerCase();
  const matches = (row: RulebookRow) =>
    [row.label, row.category, ...row.aliases].some((text) => text.toLowerCase().includes(keyword!));
  // 숨기지 않은 책은 있는데 기본 룰북이 하나도 없는 판본. 사용자 앱은 이 판본을 구인 룰로 고르지 못한다.
  const visible = db.rulebooks.filter((rulebook) => !rulebook.hidden);
  const editionsWithoutCore = uniq(
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
  );
  return {
    total: rows.length,
    rows: keyword ? rows.filter(matches) : rows,
    categories,
    editionsWithoutCore,
  };
}
