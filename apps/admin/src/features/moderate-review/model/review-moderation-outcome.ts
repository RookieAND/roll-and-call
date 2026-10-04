import type { submitReviewModeration } from "../api/submit-review-moderation";

export type ReviewModerationOutcome = Awaited<ReturnType<typeof submitReviewModeration>>;
