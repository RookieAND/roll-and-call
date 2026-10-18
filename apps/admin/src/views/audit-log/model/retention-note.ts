import { AUDIT_RETENTION_DAYS, EXPIRING_AUDIT_ACTIONS } from "@roll-and-call/database/audit/model";
export const RETENTION_NOTE = `${EXPIRING_AUDIT_ACTIONS.join(", ")} 기록은 ${AUDIT_RETENTION_DAYS}일이 지나면 삭제되고, 나머지는 계속 보관합니다.`;
