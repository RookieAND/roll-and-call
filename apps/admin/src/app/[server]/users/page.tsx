import type { Metadata } from "next";

import { MEMBERSHIP_STATUS, parseSort, type MembershipStatus } from "@/shared/lib";
import {
  USER_FILTERS,
  USER_SORT_COLUMNS,
  USER_SORT_FALLBACK,
  listUsers,
  type UserFilter,
} from "@/shared/server";
import { UsersView } from "@/views/users";

export const metadata: Metadata = { title: "유저" };

const MEMBERSHIPS: readonly string[] = Object.values(MEMBERSHIP_STATUS);

export default async function UsersPage({ searchParams }: PageProps<"/[server]/users">) {
  const query = (await searchParams) as Record<string, string | undefined>;
  const { q, filter, page, membership } = query;
  const activeFilter = filter && filter in USER_FILTERS ? (filter as UserFilter) : undefined;
  const activeMembership =
    membership && MEMBERSHIPS.includes(membership)
      ? (membership as MembershipStatus)
      : MEMBERSHIP_STATUS.active;
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
