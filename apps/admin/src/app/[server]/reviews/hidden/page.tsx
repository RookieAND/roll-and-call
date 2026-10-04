import type { Metadata } from "next";

import { REVIEW_LIST_TAB } from "@/shared/server";

import { ReviewListPage } from "../review-list-page";

export const metadata: Metadata = { title: "숨긴 후기" };

export default async function HiddenReviewsPage({
  searchParams,
}: PageProps<"/[server]/reviews/hidden">) {
  return <ReviewListPage tab={REVIEW_LIST_TAB.hidden} searchParams={await searchParams} />;
}
