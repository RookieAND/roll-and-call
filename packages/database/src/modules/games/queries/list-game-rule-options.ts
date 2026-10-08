import { count, eq } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#/client";
import { GAME_RULE_OTHER, type GameTab } from "#/modules/games/model/games-filter";
import { games, rulebookCategories, rulebooks } from "#/schema";

import { recruitingGamesWhere } from "./recruiting-games-where";

// 검색어·상태 칩·필터를 보지 않아, 고르는 도중에 칩이 사라지지 않는다.
export async function listGameRuleOptions({
  serverId,
  tab,
  now,
}: {
  serverId: string;
  tab: GameTab;
  now: Date;
}): Promise<{ key: string; label: string; count: number }[]> {
  const rows = await db
    .select({ id: rulebookCategories.id, name: rulebookCategories.name, total: count() })
    .from(games)
    .leftJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
    .leftJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
    .where(recruitingGamesWhere({ serverId, filter: { tab }, now }))
    .groupBy(rulebookCategories.id, rulebookCategories.name);

  const options = rows
    .filter((row) => !isNull(row.id))
    .map((row) => ({ key: row.id!, label: row.name!, count: row.total }))
    .toSorted((left, right) => left.label.localeCompare(right.label, "ko"));
  const other = rows.find((row) => isNull(row.id));
  if (other) options.push({ key: GAME_RULE_OTHER, label: "기타", count: other.total });
  return options;
}
