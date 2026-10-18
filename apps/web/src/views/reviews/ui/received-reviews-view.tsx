import { getReceivedReviews } from "@roll-and-call/database/reviews";
import { notFound } from "next/navigation";

import { MemberTitleSheetsProvider } from "@/features/view-badge";
import { loadMemberTitleSheets } from "@/features/view-badge/server";
import { getCurrentSessionUser, getProfile, getCurrentServer } from "@/shared/server";

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
  const titleSheets = await loadMemberTitleSheets({
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
      <MemberTitleSheetsProvider sheets={titleSheets}>
        <ReviewList
          rows={rows}
          perspective={REVIEW_PERSPECTIVE.received}
          viewerId={viewer?.id ?? null}
          emptyText="아직 진행한 세션에 후기가 없습니다"
        />
      </MemberTitleSheetsProvider>
    </ReviewsPage>
  );
}
