import "server-only";
import { recentNoShowCountsByUser } from "@roll-and-call/database/moderation/model";

import { loadAdminData } from "@/shared/server";

import { toNoShowRow } from "../model/to-no-show-row";

export async function getNoShow(id: string) {
  const db = await loadAdminData(["users", "sessions", "noShows"]);
  const noShow = db.noShows.find((candidate) => candidate.id === id);
  if (!noShow) return null;
  const now = Date.now();
  return {
    ...toNoShowRow({ db, noShow, now }),
    recentNoShowCount:
      recentNoShowCountsByUser({
        sessions: db.sessions,
        noShows: db.noShows,
        now: new Date(now),
        userIds: [noShow.userId],
      }).get(noShow.userId) ?? 0,
    gmReason: noShow.gmReason ?? null,
    added: noShow.added ?? null,
    cancellation: noShow.cancelled
      ? { by: noShow.cancelledBy!, at: noShow.cancelledAt!, reason: noShow.cancelReason! }
      : null,
  };
}

export type NoShowDetail = NonNullable<Awaited<ReturnType<typeof getNoShow>>>;
