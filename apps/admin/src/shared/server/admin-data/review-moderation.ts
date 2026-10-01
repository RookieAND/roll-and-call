import type { ReviewModerationAction } from "@roll-and-call/database/admin";

import type { ReviewReason } from "@/shared/lib";

export interface ReviewModeration {
  action: ReviewModerationAction;
  reason: ReviewReason | null;
  staffMemo: string;
}
