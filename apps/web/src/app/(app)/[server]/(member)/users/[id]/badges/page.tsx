import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { UserBadgesView } from "@/views/user-badges";

export const metadata: Metadata = { title: "업적" };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  await requireMembership();
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  return <UserBadgesView id={id} tab={tab} />;
}
