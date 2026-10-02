import type { Metadata } from "next";

import { MEMBERSHIP_STATUS, type MembershipStatus } from "@/shared/lib";
import { USER_FILTERS, listUsers, type UserFilter } from "@/shared/server";
import { UsersView } from "@/views/users";

export const metadata: Metadata = { title: "유저" };

const MEMBERSHIPS: readonly string[] = Object.values(MEMBERSHIP_STATUS);

export default async function UsersPage({ searchParams }: PageProps<"/[server]/users">) {
  const { q, filter, page, membership } = (await searchParams) as Record<
    string,
    string | undefined
  >;
  const activeFilter = filter && filter in USER_FILTERS ? (filter as UserFilter) : undefined;
  const activeMembership =
    membership && MEMBERSHIPS.includes(membership) ? (membership as MembershipStatus) : undefined;
  const rows = await listUsers({ query: q, filter: activeFilter, membership: activeMembership });
  return (
    <UsersView
      rows={rows}
      page={page}
      query={{ q, filter: activeFilter, membership: activeMembership }}
    />
  );
}
