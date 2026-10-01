import { getCurrentSessionUser, getReviewCounts } from "@/shared/server";

import { MyPageReviews } from "./my-page-reviews";

export async function MyPageReviewsSection() {
  const user = (await getCurrentSessionUser())!;
  const { received, written } = await getReviewCounts({ userId: user.id, own: true });
  return <MyPageReviews received={received} written={written} />;
}
