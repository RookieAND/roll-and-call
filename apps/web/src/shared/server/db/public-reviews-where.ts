import "server-only";
import { sessionReviews } from "@roll-and-call/database";
import { and, isNull, not } from "drizzle-orm";

import { reviewAuthorAbsentSql } from "./review-author-absent-sql";

// 숨김·제거·보류(작성자가 지금 불참)가 아닌 후기만 다른 사람에게 보인다.
export const publicReviewsWhere = and(
  isNull(sessionReviews.removedAt),
  isNull(sessionReviews.hiddenAt),
  not(reviewAuthorAbsentSql),
);
