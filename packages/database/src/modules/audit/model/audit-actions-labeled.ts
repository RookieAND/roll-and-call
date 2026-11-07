import { auditActionLabel } from "./audit-action-label";
import { RENAMED_AUDIT_ACTIONS } from "./audit-actions";

// 화면 이름(auditActionLabel)이 labels에 드는 저장된 조치 값. 이름이 바뀐 옛 값도 함께 고른다.
export function auditActionsLabeled(labels: readonly string[]) {
  return [...labels, ...Object.keys(RENAMED_AUDIT_ACTIONS)].filter((action) =>
    labels.includes(auditActionLabel(action)),
  );
}
