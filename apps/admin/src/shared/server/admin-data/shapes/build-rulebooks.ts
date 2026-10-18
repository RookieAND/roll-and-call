import type { Rulebook } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildRulebooks({ tables }: ShapeContext): Rulebook[] {
  return tables.rulebookRows
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((rulebook) => ({
      id: rulebook.id,
      name: rulebook.name,
      edition: rulebook.edition,
      category: rulebook.category,
      categoryAlias: rulebook.categoryAlias,
      categoryMiniRule: rulebook.categoryMiniRule,
      kind: rulebook.kind,
      supersedesId: rulebook.supersedesId,
      aliases: rulebook.aliases,
      certRequired: rulebook.certRequired,
      hidden: rulebook.hidden,
    }));
}
