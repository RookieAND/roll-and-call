import { notFound } from "next/navigation";

import { RepresentativeTitlesProvider } from "@/entities/badge";
import { loadRepresentativeTitles } from "@/entities/badge/server";
import {
  getCurrentSessionUser,
  getProfile,
  getReceivedReviews,
  getCurrentServer,
} from "@/shared/server";

import { REVIEW_PERSPECTIVE } from "../model/review-perspective";
import { ReviewList } from "./review-list";
import { ReviewsPage } from "./reviews-page";

interface ReceivedReviewsViewProps {
  userId?: string;
}

export async function ReceivedReviewsView({ userId }: ReceivedReviewsViewProps) {
  const viewer = await getCurrentSessionUser();
  const targetId = userId ?? viewer?.id;
  if (!targetId) notFound();
  const server = await getCurrentServer();
  const [profile, rows] = await Promise.all([
    getProfile(server.id, targetId),
    getReceivedReviews({ serverId: server.id, gmId: targetId, viewerId: viewer?.id ?? null }),
  ]);
  if (!profile) notFound();
  const titles = await loadRepresentativeTitles({
    serverId: server.id,
    userIds: rows.map((row) => row.authorId),
    now: new Date(),
  });
  const mine = targetId === viewer?.id;

  return (
    <ReviewsPage
      title={mine ? "진행한 세션 후기" : `${profile.username}님이 진행한 세션 후기`}
      back={mine ? "/me" : `/users/${targetId}`}
    >
      <RepresentativeTitlesProvider titles={titles}>
        <ReviewList
          rows={rows}
          perspective={REVIEW_PERSPECTIVE.received}
          viewerId={viewer?.id ?? null}
          emptyText="아직 진행한 세션에 후기가 없습니다"
        />
      </RepresentativeTitlesProvider>
    </ReviewsPage>
  );
}
