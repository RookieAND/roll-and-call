import type { Metadata } from "next";

import {
  isMembershipStatus,
  USER_SORT_COLUMNS,
  USER_SORT_FALLBACK,
  isUserFilter,
} from "@/entities/user";
import { listUsers } from "@/entities/user/server";
import { MEMBERSHIP_STATUS, parseSort, stringParams } from "@/shared/lib";
import { UsersMobileView, UsersView } from "@/views/users";

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
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <UsersView
          rows={rows}
          membershipCounts={membershipCounts}
          sort={sort}
          page={page}
          query={query}
          filter={activeFilter}
          membership={activeMembership}
        />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <UsersMobileView
          rows={rows}
          membershipCounts={membershipCounts}
          sort={sort}
          query={query}
          filter={activeFilter}
          membership={activeMembership}
        />
      </div>
    </>
  );
}
