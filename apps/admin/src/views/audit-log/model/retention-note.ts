import { intersection } from "es-toolkit";

import { AUDIT_ACTIONS, AUDIT_RETENTION_DAYS, EXPIRING_AUDIT_ACTIONS } from "@/shared/server";

// 지난 조치 이름(안내 DM)은 지울 대상이지만 안내 문구에는 쓰지 않는다.
const LISTED = intersection<string>(EXPIRING_AUDIT_ACTIONS, AUDIT_ACTIONS);

export const RETENTION_NOTE = `${LISTED.join(", ")} 기록은 ${AUDIT_RETENTION_DAYS}일이 지나면 삭제되고, 나머지는 계속 보관합니다.`;
