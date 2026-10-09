import type { Metadata } from "next";

import { isMembershipStatus, MEMBERSHIP_STATUS, parseSort, stringParams } from "@/shared/lib";
import { USER_SORT_COLUMNS, USER_SORT_FALLBACK, listUsers, isUserFilter } from "@/shared/server";
import { UsersView } from "@/views/users";

export const metadata: Metadata = { title: "유저" };

export default async function UsersPage({ searchParams }: PageProps<"/[server]/users">) {
  const query = stringParams(await searchParams);
  const { q, filter, page, membership } = query;
  const activeFilter = isUserFilter(filter) ? filter : undefined;
  const activeMembership = isMembershipStatus(membership) ? membership : MEMBERSHIP_STATUS.active;
  const sort = parseSort({
    searchParams: query,
    columns: USER_SORT_COLUMNS,
    fallback: USER_SORT_FALLBACK,
  });
  const { rows, membershipCounts } = await listUsers({
    query: q,
    filter: activeFilter,
    membership: activeMembership,
    sort,
  });
  return (
    <UsersView
      rows={rows}
      membershipCounts={membershipCounts}
      sort={sort}
      page={page}
      query={query}
      filter={activeFilter}
      membership={activeMembership}
    />
  );
}
