import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { MyBadgesView } from "@/views/my-badges";

export const metadata: Metadata = { title: "업적 도감" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  await requireMembership();
  const { tab } = await searchParams;
  return <MyBadgesView tab={tab} />;
}
