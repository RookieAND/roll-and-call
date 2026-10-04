import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { FeaturedBadgesView } from "@/views/featured-badges";

export const metadata: Metadata = { title: "대표 뱃지" };

export default async function Page() {
  await requireMembership();
  return <FeaturedBadgesView />;
}
