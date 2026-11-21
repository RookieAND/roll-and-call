import { loadMembersBadges } from "@roll-and-call/database/badges";
import { getServerUsersPage } from "@roll-and-call/database/profiles";
import { groupBy } from "es-toolkit";

import { heldBadges, monthLabel, pickFeaturedBadges } from "@/entities/badge";
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
  const records = await loadMembersBadges({
    serverId: server.id,
    userIds: rows.map((row) => row.userId),
  });
  const recordsByUser = groupBy(records, (record) => record.userId);
  const now = new Date();
  return {
    total,
    rows: rows.map(({ featuredBadges, joinedAt: _joinedAt, ...row }) => {
      const featured = pickFeaturedBadges({
        featuredKeys: featuredBadges,
        held: heldBadges(recordsByUser[row.userId] ?? [], now),
      })[0];
      const title = featured
        ? {
            emoji: featured.emoji,
            name: featured.name,
            look: featured.look,
            tag: featured.monthKey ? monthLabel(featured.monthKey) : null,
          }
        : null;
      return { ...row, title };
    }),
  };
}
