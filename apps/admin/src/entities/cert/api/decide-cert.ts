import "server-only";
import { type Actor } from "@roll-and-call/database/audit";
import {
  decideCertApplication,
  type CertDecision,
  type CertDecisionResult,
} from "@roll-and-call/database/certifications";
import { certWaitingOn } from "@roll-and-call/database/certifications/model";
import { loadCertDecisionRecords } from "@roll-and-call/database/moderation";

import { waitingSupplements } from "../model/waiting-supplements";

// 기본 룰북이 결정되기 전의 서플리먼트는 막는다. 기본 룰북을 반려하면 기대는 서플리먼트도 반려한다.
export async function decideCert({
  serverId,
  id,
  actor,
  decision,
  notify,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  decision: CertDecision;
  notify?: boolean;
}): Promise<CertDecisionResult> {
  // ponytail: 막는 조건은 트랜잭션 밖에서 읽은 기록으로 본다. 두 운영진이 같은 순간 기본 룰북과 서플리먼트를 처리하는 경합은 막지 않는다.
  const records = await loadCertDecisionRecords({ serverId, applicationIds: [id] });
  const application = records.certApplications.find((row) => row.id === id);
  if (application?.status === "pending" && certWaitingOn(application, records).length) {
    return { ok: false, blocked: "기본 룰북이 결정된 뒤에 심사할 수 있습니다" };
  }
  return decideCertApplication({
    serverId,
    id,
    actor,
    decision,
    notify,
    waitingSupplements:
      application && decision.kind === "reject" ? waitingSupplements(records, application) : null,
  });
}
