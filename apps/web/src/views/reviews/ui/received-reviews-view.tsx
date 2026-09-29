import { notFound } from "next/navigation";

import { getCurrentSessionUser, getProfile, getReceivedReviews } from "@/shared/server";

import { REVIEW_PERSPECTIVE } from "../model/review-perspective";
import { ReviewList } from "./review-list";
import { ReviewsPage } from "./reviews-page";

interface ReceivedReviewsViewProps {
  // 없으면 로그인한 본인(마이페이지에서 들어옴).
  userId?: string;
}

export async function ReceivedReviewsView({ userId }: ReceivedReviewsViewProps) {
  const viewer = await getCurrentSessionUser();
  const targetId = userId ?? viewer?.id;
  if (!targetId) notFound();
  const [profile, rows] = await Promise.all([getProfile(targetId), getReceivedReviews(targetId)]);
  if (!profile) notFound();
  const mine = targetId === viewer?.id;

  return (
    <ReviewsPage
      title={mine ? "진행한 세션 후기" : `${profile.username}님이 진행한 세션 후기`}
      back={mine ? "/me" : `/u/${targetId}`}
    >
      <ReviewList
        rows={rows}
        perspective={REVIEW_PERSPECTIVE.received}
        viewerId={viewer?.id ?? null}
        emptyText="아직 진행한 세션에 후기가 없습니다"
      />
    </ReviewsPage>
  );
}
