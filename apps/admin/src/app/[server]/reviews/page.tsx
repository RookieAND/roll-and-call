import type { Metadata } from "next";

import { REVIEW_LIST_TAB } from "@/shared/server";

import { ReviewListPage } from "./review-list-page";

export const metadata: Metadata = { title: "전체 후기" };

export default async function AllReviewsPage({ searchParams }: PageProps<"/[server]/reviews">) {
  return <ReviewListPage tab={REVIEW_LIST_TAB.all} searchParams={await searchParams} />;
}
