import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";
import { compact, maxBy, uniqBy } from "es-toolkit";

import { CERT_MANAGE_STATUS } from "@/shared/lib";

import { CERT_GRANT_METHOD, type CertManageRow } from "./cert-manage-row";
import { editionCertGroups } from "./edition-cert-groups";
import { isSanctioned } from "./is-sanctioned";
import type { Snapshot } from "./snapshot";

type CertRecords = Pick<Snapshot, "users" | "rulebooks" | "certifications" | "certApplications">;

// 유저 × 책마다 지금 상태 하나: 인증이 있으면 인증됨, 없으면 마지막 신청(거둔 신청 제외)이 심사 중·반려됨.
// 인증한 방법은 승인된 사진·구매 내역 신청이 있으면 사진 심사, 없으면 운영진 부여다.
export function certManageRows({
  records,
  now,
}: {
  records: CertRecords;
  now: number;
}): CertManageRow[] {
  const groups = editionCertGroups(records.rulebooks);
  const applications = records.certApplications.filter(
    (application) => application.status !== "withdrawn",
  );
  const pairs = uniqBy(
    [...records.certifications, ...applications].map(({ userId, rulebookId }) => ({
      userId,
      rulebookId,
    })),
    (pair) => `${pair.userId}:${pair.rulebookId}`,
  );
  return compact(
    pairs.map(({ userId, rulebookId }) => {
      const user = records.users.find((candidate) => candidate.id === userId);
      const book = records.rulebooks.find((candidate) => candidate.id === rulebookId);
      if (!user || !book) return null;
      const mine = applications.filter(
        (application) => application.userId === userId && application.rulebookId === rulebookId,
      );
      const certification = records.certifications.find(
        (item) => item.userId === userId && item.rulebookId === rulebookId,
      );
      const latest = maxBy(mine, (application) => application.appliedAt.getTime());
      const base = {
        key: `${userId}:${rulebookId}`,
        userId,
        nickname: user.nickname,
        discordId: user.discordId,
        discordHandle: user.discordHandle,
        sanctioned: isSanctioned(user, now),
        rulebookId,
        rulebook: rulebookLabel(book),
        edition: `${book.category} ${book.edition}`.trim(),
      };
      if (certification) {
        const certifiedIds = new Set(
          records.certifications
            .filter((item) => item.userId === userId)
            .map((item) => item.rulebookId),
        );
        const group = groups.find((candidate) => candidate.bookIds.has(rulebookId));
        const photo = mine.some(
          (application) => application.status === "approved" && !application.direct,
        );
        return {
          ...base,
          editionEligible: group ? group.eligible(certifiedIds) : null,
          method: photo ? CERT_GRANT_METHOD.photo : CERT_GRANT_METHOD.staff,
          status: CERT_MANAGE_STATUS.certified,
          changedAt: certification.approvedAt,
          applicationId: null,
        };
      }
      if (!latest || latest.status === "approved") return null;
      const pending = latest.status === "pending";
      return {
        ...base,
        editionEligible: null,
        method: latest.direct ? CERT_GRANT_METHOD.staff : CERT_GRANT_METHOD.photo,
        status: pending ? CERT_MANAGE_STATUS.pending : CERT_MANAGE_STATUS.rejected,
        changedAt: pending ? latest.appliedAt : (latest.processedAt ?? latest.appliedAt),
        applicationId: latest.id,
      };
    }),
  );
}
