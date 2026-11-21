import { getServerUsersPage } from "@roll-and-call/database/profiles";

import { loadMemberTitleSheets } from "@/features/view-badge/server";
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
  const titleSheets = await loadMemberTitleSheets({
    serverId: server.id,
    userIds: rows.map((row) => row.userId),
    now: new Date(),
  });
  return {
    total,
    titleSheets,
    rows: rows.map(({ featuredBadges: _featuredBadges, joinedAt: _joinedAt, ...row }) => row),
  };
}
