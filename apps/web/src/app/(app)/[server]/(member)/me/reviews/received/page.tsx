import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { ReceivedReviewsView } from "@/views/reviews";

export const metadata: Metadata = { title: "진행한 세션 후기" };
export default async function Page() {
  await requireMembership();
  return <ReceivedReviewsView />;
}
