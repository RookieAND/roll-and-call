import "server-only";
import { certBlockers } from "./cert-blockers";
import { countRecentNoShows } from "./count-recent-no-shows";
import { loadSnapshot } from "./snapshot";
import { waitedDays } from "./waited-days";

export async function getCertReview(id: string) {
  const db = await loadSnapshot();
  const application = db.certApplications.find((candidate) => candidate.id === id);
  if (!application) return null;
  const user = db.users.find((candidate) => candidate.id === application.userId)!;
  const queue = db.certApplications
    .filter((candidate) => candidate.status === "pending")
    .toSorted((a, b) => a.appliedAt.getTime() - b.appliedAt.getTime());
  const index = queue.findIndex((candidate) => candidate.id === id);
  const others = queue.filter((candidate) => candidate.id !== id);
  const next = others[Math.max(0, index)] ?? others[0];

  return {
    id: application.id,
    rulebook: application.rulebook,
    format: application.format,
    blockers: application.status === "pending" ? certBlockers(application, db) : null,
    quiz: application.quiz ?? null,
    appliedAt: application.appliedAt,
    waitedDays: waitedDays(application.appliedAt),
    memo: application.memo,
    photoUrls: application.photoUrls,
    replacedShots: application.replacedShots,
    purchase: application.purchase,
    sellerRegistered: db.sellers.some((seller) => seller.name === application.purchase.seller),
    previousRejections: application.previousRejections,
    applicant: {
      id: user.id,
      nickname: user.nickname,
      discordHandle: user.discordHandle,
      joinedAt: user.joinedAt,
      hostedCount: user.hostedCount,
      playedCount: user.playedCount,
      recentNoShowCount: countRecentNoShows(db, user.id),
    },
    position: index >= 0 ? { index: index + 1, total: queue.length } : null,
    nextId: next?.id ?? null,
    withdrawnAt: application.status === "withdrawn" ? (application.processedAt ?? null) : null,
    processed:
      application.status === "approved" || application.status === "rejected"
        ? {
            status: application.status,
            by: application.processedBy!,
            at: application.processedAt!,
          }
        : null,
  };
}

export type CertReview = NonNullable<Awaited<ReturnType<typeof getCertReview>>>;
