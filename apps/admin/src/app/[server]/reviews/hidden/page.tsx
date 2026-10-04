import type { Metadata } from "next";

import { listHiddenReviews } from "@/shared/server";
import { HiddenReviewsView } from "@/views/hidden-reviews";

export const metadata: Metadata = { title: "숨긴 후기" };

export default async function HiddenReviewsPage({
  searchParams,
}: PageProps<"/[server]/reviews/hidden">) {
  const { q } = (await searchParams) as Record<string, string | undefined>;
  const reviews = await listHiddenReviews(q);
  return <HiddenReviewsView reviews={reviews} />;
}
