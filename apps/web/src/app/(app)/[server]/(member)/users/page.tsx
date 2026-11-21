import type { Metadata } from "next";

import { parseUsersFilter, UsersView } from "@/views/users";

export const metadata: Metadata = { title: "유저" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    cert?: string;
    host?: string;
    recruiting?: string;
    sort?: string;
  }>;
}) {
  const { page, ...params } = await searchParams;
  return <UsersView filter={parseUsersFilter(params)} page={Number(page) || 1} />;
}
