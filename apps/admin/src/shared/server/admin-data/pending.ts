import "server-only";
import { certWaitingOn } from "@roll-and-call/database/certifications/model";
import { loadPendingQueue } from "@roll-and-call/database/moderation";
import { cache } from "react";

import { getCurrentServer } from "../auth/get-current-server";
import { requireStaff } from "../auth/require-staff";
import { buildPendingItems, type PendingItem } from "./build-pending-items";

// 사이드바 건수·홈 처리 대기·폰 안내·⌘K가 모두 이 한 곳에서 읽는다. 처리 대기는 3종이다(D212 + 자작 룰).
// 레이아웃이 화면 이동마다 부르므로 스냅숏 대신 처리 대기에 필요한 행만 읽는다.
export const getPendingItems = cache(async (): Promise<PendingItem[]> => {
  await requireStaff();
  const server = await getCurrentServer();
  const { applicationRows, rulebookRows, certificationRows, requestRows, homebrewRows } =
    await loadPendingQueue(server.id);
  const records = {
    rulebooks: rulebookRows,
    certApplications: applicationRows,
    certifications: certificationRows,
  };
  return buildPendingItems({
    certs: applicationRows.map((application) => ({
      id: application.id,
      at: application.appliedAt,
      reviewable: certWaitingOn(application, records).length === 0,
    })),
    homebrews: homebrewRows.map((homebrew) => ({ id: homebrew.id, at: homebrew.appliedAt })),
    rulebookRequests: requestRows.map((request) => ({ at: request.requestedAt })),
  });
});
