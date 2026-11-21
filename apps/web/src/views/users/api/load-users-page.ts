import { getServerUsersPage } from "@roll-and-call/database/profiles";
import type { RankingMode } from "@roll-and-call/database/servers/model";

import { monthRankMedals } from "@/entities/badge";
import { loadMonthRecord } from "@/entities/badge/server";
import { loadMemberTitleSheets } from "@/features/view-badge/server";
import { toKst } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";

import type { UsersFilter } from "../model/users-filter";
import type { UsersPage } from "../model/users-page";

export async function loadUsersPage({
  filter,
  page,
}: {
  filter: UsersFilter;
  page: number;
}): Promise<UsersPage> {
  const server = await getCurrentServer();
  const { rows, total } = await getServerUsersPage({
    serverId: server.id,
    page,
    q: filter.q,
    certifiedRulebookId: filter.cert,
    hostedRulebookId: filter.host,
    recruitingOnly: filter.recruiting,
    sort: filter.sort,
  });
  const now = new Date();
  const monthStart = toKst(now).startOf("month");
  const [titleSheets, record] = await Promise.all([
    loadMemberTitleSheets({ serverId: server.id, userIds: rows.map((row) => row.userId), now }),
    loadMonthRecord({
      serverId: server.id,
      rankingMode: server.rankingMode as RankingMode,
      from: monthStart.toDate(),
      to: monthStart.add(1, "month").toDate(),
      now,
    }),
  ]);
  const medals = monthRankMedals(record);
  return {
    total,
    titleSheets,
    rows: rows.map(({ featuredBadges: _featuredBadges, joinedAt: _joinedAt, ...row }) => ({
      ...row,
      medals: medals.get(row.userId) ?? [],
    })),
  };
}
