import { auditLogHref, CERT_MANAGE_STATUS, withQuery } from "@/shared/lib";
import type { CertManageRow } from "@/shared/server";

import { CERT_ROW_ACTION, type CertRowActionLink } from "./cert-row-action";

// 인증됨: 반려로 돌리기·활동 기록, 심사 중: 심사 상세·활동 기록, 반려됨: 활동 기록 하나(D288, D293).
export function certRowActions({
  row,
  query,
}: {
  row: CertManageRow;
  query: Record<string, string | undefined>;
}): CertRowActionLink[] {
  const log = { action: CERT_ROW_ACTION.log, href: auditLogHref({ targetUserId: row.userId }) };
  if (row.status === CERT_MANAGE_STATUS.certified) {
    const revoke = withQuery("/cert/manage", query, {
      action: CERT_ROW_ACTION.revoke,
      user: row.userId,
      rulebook: row.rulebookId,
    });
    return [{ action: CERT_ROW_ACTION.revoke, href: revoke }, log];
  }
  if (row.status === CERT_MANAGE_STATUS.pending && row.applicationId) {
    return [{ action: CERT_ROW_ACTION.review, href: `/cert/${row.applicationId}` }, log];
  }
  return [log];
}
