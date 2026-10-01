import { getCurrentSessionUser, getReviewCounts, getCurrentServer } from "@/shared/server";

import { MyPageReviews } from "./my-page-reviews";

export async function MyPageReviewsSection() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const { received, written } = await getReviewCounts({
    serverId: server.id,
    userId: user.id,
    own: true,
  });
  return <MyPageReviews received={received} written={written} />;
}
