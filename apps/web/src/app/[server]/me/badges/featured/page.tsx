import type { Metadata } from "next";

import { FeaturedBadgesView } from "@/views/featured-badges";

export const metadata: Metadata = { title: "대표 뱃지" };

export default function Page() {
  return <FeaturedBadgesView />;
}
