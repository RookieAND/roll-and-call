import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { SessionReviewsView } from "@/views/reviews";

export const metadata: Metadata = { title: "세션 후기" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <SessionReviewsView gameId={id} />;
}
