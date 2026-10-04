import { eq } from "drizzle-orm";
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
}): Promise<{ key: string; label: string }[]> {
  const rows = await db
    .selectDistinct({ id: rulebookCategories.id, name: rulebookCategories.name })
    .from(games)
    .leftJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
    .leftJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
    .where(recruitingGamesWhere({ serverId, filter: { tab }, now }));

  const options = rows
    .filter((row) => !isNull(row.id))
    .map((row) => ({ key: row.id!, label: row.name! }))
    .toSorted((left, right) => left.label.localeCompare(right.label, "ko"));
  if (rows.some((row) => isNull(row.id))) options.push({ key: GAME_RULE_OTHER, label: "기타" });
  return options;
}
