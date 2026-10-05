import "server-only";
import { loadSnapshot } from "./snapshot";

// 후기 상세의 탭 제목은 구인 제목이다. 지운 후기는 없는 것으로 본다.
export async function getReviewTitle(id: string) {
  const db = await loadSnapshot();
  const review = db.reviews.find((candidate) => candidate.id === id && !candidate.removed);
  return db.sessions.find((session) => session.id === review?.sessionId)?.title;
}
