import { eq } from "drizzle-orm";

import { REVIEW_AUTHOR_ROLE } from "#/modules/games/model/review-author-role";
import { sessionReviews } from "#/schema";

// 후기 수·업적·진행한 세션 후기 목록은 참석자 후기만 센다. GM 마스터링 후기는 뺀다.
export const participantReviewWhere = eq(sessionReviews.authorRole, REVIEW_AUTHOR_ROLE.participant);
