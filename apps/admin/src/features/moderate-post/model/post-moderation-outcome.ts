import type { submitPostModeration } from "../api/submit-post-moderation";

export type PostModerationOutcome = Awaited<ReturnType<typeof submitPostModeration>>;
