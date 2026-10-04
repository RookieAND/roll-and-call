import "server-only";
import { compact, mapValues } from "es-toolkit";

import { certBlockers } from "./cert-blockers";
import type { CertQueueFilter } from "./cert-queue-filter";
import { certQueueRows } from "./cert-queue-rows";
import { filterCertQueue } from "./filter-cert-queue";
import { nextReviewableId } from "./next-reviewable-id";
import { signCertPhotoUrls } from "./sign-cert-photos";
import { loadSnapshot } from "./snapshot";
import type { ShotKey } from "./types";
import { waitedDays } from "./waited-days";

// filter는 대기열에서 고른 필터다. [다음 건]은 그 안에서 다음 심사 가능 건이다.
export async function getCertReview({ id, filter }: { id: string; filter: CertQueueFilter }) {
  const db = await loadSnapshot();
  const application = db.certApplications.find((candidate) => candidate.id === id);
  if (!application) return null;
  const user = db.users.find((candidate) => candidate.id === application.userId)!;
  const queue = certQueueRows({
    records: db,
    applications: db.certApplications.filter(
      (candidate) => candidate.status === "pending" || candidate.id === id,
    ),
  });
  const latestRejection = application.previousRejections.at(-1) ?? null;
  const signed = await signCertPhotoUrls(
    compact([
      ...Object.values(application.photoUrls),
      application.purchase.captureUrl,
      application.purchase.receiptUrl,
      ...Object.values(latestRejection?.photoUrls ?? {}),
    ]),
  );
  const signedShots = (urls: Partial<Record<ShotKey, string>>) =>
    mapValues(urls, (url) => (url ? signed.get(url) : undefined));
  const sign = (url: string | null) => (url ? (signed.get(url) ?? null) : null);
  const pending = application.status === "pending";
  const blockers = pending ? certBlockers(application, db) : null;
  const processed =
    application.status === "approved" || application.status === "rejected"
      ? { status: application.status, at: application.processedAt! }
      : null;
  const photoUrls = signedShots(application.photoUrls);
  const captureUrl = sign(application.purchase.captureUrl);
  const receiptUrl = sign(application.purchase.receiptUrl);
  const hasProof = compact([...Object.values(photoUrls), captureUrl, receiptUrl]).length > 0;

  return {
    id: application.id,
    rulebookId: application.rulebookId,
    rulebook: application.rulebook,
    format: application.format,
    waitingOn: blockers?.waitingOn ?? [],
    duplicate: blockers?.duplicate ?? null,
    quiz: application.quiz ?? null,
    appliedAt: application.appliedAt,
    waitedDays: waitedDays(application.appliedAt),
    memo: application.memo,
    photoUrls,
    replacedShots: application.replacedShots,
    purchase: { ...application.purchase, captureUrl, receiptUrl },
    sellerRegistered: db.sellers.some((seller) => seller.name === application.purchase.seller),
    previousRejectionCount: application.previousRejections.length,
    latestRejection: latestRejection && {
      ...latestRejection,
      photoUrls: signedShots(latestRejection.photoUrls),
    },
    applicant: {
      id: user.id,
      nickname: user.nickname,
      discordHandle: user.discordHandle,
    },
    nextId: nextReviewableId({ rows: filterCertQueue({ rows: queue, filter }), currentId: id }),
    withdrawnAt: application.status === "withdrawn" ? (application.processedAt ?? null) : null,
    processed,
    // 처리된 신청의 증빙이 보관 기간이 지나 지워진 경우
    proofDeleted: Boolean(processed) && !hasProof,
  };
}

export type CertReview = NonNullable<Awaited<ReturnType<typeof getCertReview>>>;
