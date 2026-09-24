import "server-only";
import { db } from "./mock-db";
import { rulebookLabel } from "./rulebook-label";

export interface RulebookRow {
  id: string;
  name: string;
  label: string;
  edition: string;
  aliases: string[];
  certRequired: boolean;
  hidden: boolean;
  certifiedCount: number;
}

// 검색어는 이름·판본·다른 이름에서 부분 일치로 찾는다.
export async function listRulebooks({ query }: { query?: string } = {}) {
  const rows: RulebookRow[] = db.rulebooks.map((rulebook) => {
    const label = rulebookLabel(rulebook);
    return {
      id: rulebook.id,
      name: rulebook.name,
      label,
      edition: rulebook.edition,
      aliases: rulebook.aliases,
      certRequired: rulebook.certRequired,
      hidden: rulebook.hidden,
      certifiedCount: db.certifications.filter((item) => item.rulebook === label).length,
    };
  });
  const keyword = query?.trim().toLowerCase();
  const matches = (row: RulebookRow) =>
    [row.label, ...row.aliases].some((text) => text.toLowerCase().includes(keyword!));
  return { total: rows.length, rows: keyword ? rows.filter(matches) : rows };
}
