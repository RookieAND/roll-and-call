import { getCurrentSessionUser, getReviewCounts, getCurrentServer } from "@/shared/server";
import { countRecordSessions } from "@/widgets/session-list";

import { loadMyPageSessions } from "../api/load-my-page-sessions";
import { MyPageReviews } from "./my-page-reviews";

export async function MyPageReviewsSection() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const [{ received, written }, { hosted, joined }] = await Promise.all([
    getReviewCounts({ serverId: server.id, userId: user.id, viewerId: user.id, own: true }),
    loadMyPageSessions(server.id, user.id),
  ]);
  // 진행한 세션 후기 줄은 GM으로 연 인정 세션이 1회 이상일 때만 보인다(R2).
  const hostedRecord = countRecordSessions({ hosted, joined, userId: user.id }).hosted > 0;
  return <MyPageReviews received={received} written={written} showReceived={hostedRecord} />;
}
