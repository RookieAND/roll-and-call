import { notFound, redirect } from "next/navigation";

import { getCurrentSessionUser, getProfile, getWrittenReviews } from "@/shared/server";

import { REVIEW_PERSPECTIVE } from "../model/review-perspective";
import { ReviewList } from "./review-list";
import { ReviewsPage } from "./reviews-page";

interface WrittenReviewsViewProps {
  userId: string;
}

export async function WrittenReviewsView({ userId }: WrittenReviewsViewProps) {
  const [viewer, profile, rows] = await Promise.all([
    getCurrentSessionUser(),
    getProfile(userId),
    getWrittenReviews(userId),
  ]);
  if (viewer?.id === userId) redirect("/me/reviews");
  if (!profile) notFound();

  return (
    <ReviewsPage title={`${profile.username}님이 작성한 후기`} back={`/u/${userId}`}>
      <ReviewList
        rows={rows}
        perspective={REVIEW_PERSPECTIVE.written}
        viewerId={viewer?.id ?? null}
        emptyText="아직 작성한 후기가 없습니다"
      />
    </ReviewsPage>
  );
}
