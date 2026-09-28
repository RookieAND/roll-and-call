import "server-only";
import { reviewReasonLabel } from "@/shared/lib";

import { reviewTabCounts } from "./review-tab-counts";
import { loadSnapshot } from "./snapshot";

export async function listHiddenReviews(query: string | undefined) {
  const db = await loadSnapshot();
  const needle = query?.trim().toLowerCase();
  const rows = db.reviews
    .filter((review) => review.hidden && !review.removed)
    .map((review) => {
      const hidden = review.hidden!;
      return {
        id: review.id,
        authorNickname:
          db.users.find((user) => user.id === review.authorId)?.nickname ?? "알 수 없음",
        sessionTitle: db.sessions.find((session) => session.id === review.sessionId)?.title ?? "",
        hiddenReason: reviewReasonLabel(hidden.reason),
        hiddenAt: hidden.at,
        editedAfterHidden: review.editedAt && review.editedAt > hidden.at ? review.editedAt : null,
      };
    })
    .filter((row) => !needle || row.authorNickname.toLowerCase().includes(needle))
    .toSorted(
      (a, b) =>
        (b.editedAfterHidden?.getTime() ?? 0) - (a.editedAfterHidden?.getTime() ?? 0) ||
        b.hiddenAt.getTime() - a.hiddenAt.getTime(),
    );
  return { rows, counts: reviewTabCounts(db) };
}

export type HiddenReviewRow = Awaited<ReturnType<typeof listHiddenReviews>>["rows"][number];
