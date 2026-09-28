import type { Metadata } from "next";

import { listReportedReviews } from "@/shared/server";
import { ReportedReviewsView } from "@/views/reported-reviews";

export const metadata: Metadata = { title: "신고된 후기" };

export default async function ReportedReviewsPage({ searchParams }: PageProps<"/posts/reviews">) {
  const { q, reason } = (await searchParams) as Record<string, string | undefined>;
  const reviews = await listReportedReviews({ query: q, reason });
  return <ReportedReviewsView reviews={reviews} />;
}
