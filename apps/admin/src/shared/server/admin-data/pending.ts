import "server-only";
import { cache } from "react";

import { buildPendingItems, type PendingItem } from "./build-pending-items";
import { certBlockers } from "./cert-blockers";
import { loadSnapshot } from "./snapshot";

// 사이드바 건수·홈 처리 대기·폰 안내·⌘K가 모두 이 한 곳에서 읽는다. 처리 대기는 2종이다(D212).
export const getPendingItems = cache(async (): Promise<PendingItem[]> => {
  const db = await loadSnapshot();
  const pendingCerts = db.certApplications.filter(
    (application) => application.status === "pending",
  );
  return buildPendingItems({
    certs: pendingCerts.map((application) => ({
      id: application.id,
      at: application.appliedAt,
      reviewable: certBlockers(application, db).waitingOn.length === 0,
    })),
    rulebookRequests: db.rulebookRequests
      .filter((request) => !request.processed)
      .map((request) => ({ at: request.requestedAt })),
  });
});
