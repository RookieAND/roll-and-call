import type { Metadata } from "next";

import { USER_FILTERS, listUsers, type UserFilter } from "@/shared/server";
import { UsersView } from "@/views/users";

export const metadata: Metadata = { title: "유저" };

export default async function UsersPage({ searchParams }: PageProps<"/users">) {
  const { q, filter, page } = (await searchParams) as Record<string, string | undefined>;
  const activeFilter = filter && filter in USER_FILTERS ? (filter as UserFilter) : undefined;
  const rows = await listUsers({ query: q, filter: activeFilter });
  return <UsersView rows={rows} page={page} query={{ q, filter: activeFilter }} />;
}
