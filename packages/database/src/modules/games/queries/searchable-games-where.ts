import { and, ilike, or, type SQL } from "drizzle-orm";

import { games } from "#/schema";

import { publicGamesWhere } from "./public-games-where";

// LIKE의 기본 이스케이프 문자가 역슬래시라, 검색어의 \ % _를 글자로 찾게 앞에 역슬래시를 붙인다.
export function searchableGamesWhere({
  serverId,
  q,
  includeCancelled,
}: {
  serverId: string;
  q: string | undefined;
  includeCancelled?: boolean;
}) {
  const conditions: SQL[] = [publicGamesWhere(serverId, { includeCancelled })];
  const query = q?.trim();
  if (query) {
    const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
    conditions.push(or(ilike(games.title, pattern), ilike(games.rule, pattern))!);
  }
  return and(...conditions)!;
}
