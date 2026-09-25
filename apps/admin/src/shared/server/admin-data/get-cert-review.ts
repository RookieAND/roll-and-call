import "server-only";
import { countRecentNoShows } from "./count-recent-no-shows";
import { loadSnapshot } from "./snapshot";
import { waitedDays } from "./waited-days";

// 심사 상세 한 건. 이미 처리된 건이면 processed가 채워지고 대기열 위치는 없다.
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
    appliedAt: application.appliedAt,
    waitedDays: waitedDays(application.appliedAt),
    memo: application.memo,
    photoUrls: application.photoUrls,
    replacedShots: application.replacedShots,
    purchase: application.purchase,
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
    processed:
      application.status === "pending"
        ? null
        : {
            status: application.status,
            by: application.processedBy!,
            at: application.processedAt!,
          },
  };
}

export type CertReview = NonNullable<Awaited<ReturnType<typeof getCertReview>>>;
