import "server-only";
import { countRecentNoShows } from "./count-recent-no-shows";
import { db } from "./mock-db";
import { toNoShowRow } from "./to-no-show-row";

export async function getNoShow(id: string) {
  const noShow = db.noShows.find((candidate) => candidate.id === id);
  if (!noShow) return null;
  return {
    ...toNoShowRow(noShow),
    recordedAt: noShow.recordedAt,
    recentNoShowCount: countRecentNoShows(noShow.userId),
    cancellation: noShow.cancelled
      ? { by: noShow.cancelledBy!, at: noShow.cancelledAt!, reason: noShow.cancelReason! }
      : null,
  };
}

export type NoShowDetail = NonNullable<Awaited<ReturnType<typeof getNoShow>>>;
