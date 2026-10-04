import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { MyReviewsView } from "@/views/my-reviews";

export const metadata: Metadata = { title: "작성한 후기" };
export default async function Page() {
  await requireMembership();
  return <MyReviewsView />;
}
