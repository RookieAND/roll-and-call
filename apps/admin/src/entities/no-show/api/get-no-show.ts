import "server-only";
import { countRecentNoShows } from "@/shared/lib";
import { loadSnapshot } from "@/shared/server";

import { toNoShowRow } from "../model/to-no-show-row";

export async function getNoShow(id: string) {
  const db = await loadSnapshot();
  const noShow = db.noShows.find((candidate) => candidate.id === id);
  if (!noShow) return null;
  const now = Date.now();
  return {
    ...toNoShowRow({ db, noShow, now }),
    recentNoShowCount: countRecentNoShows(db, noShow.userId, now),
    gmReason: noShow.gmReason ?? null,
    added: noShow.added ?? null,
    cancellation: noShow.cancelled
      ? { by: noShow.cancelledBy!, at: noShow.cancelledAt!, reason: noShow.cancelReason! }
      : null,
  };
}

export type NoShowDetail = NonNullable<Awaited<ReturnType<typeof getNoShow>>>;
