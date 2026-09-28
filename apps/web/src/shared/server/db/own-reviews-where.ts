import "server-only";
import { sessionReviews } from "@roll-and-call/database";
import { and, eq, isNotNull, isNull, or } from "drizzle-orm";

// 작성자가 지운 후기(removed_by가 비어 있음)만 빼고, 운영진이 숨기거나 지운 것까지 본인에게 보인다.
export function ownReviewsWhere(authorId: string) {
  return and(
    eq(sessionReviews.authorId, authorId),
    or(isNull(sessionReviews.removedAt), isNotNull(sessionReviews.removedBy)),
  );
}
