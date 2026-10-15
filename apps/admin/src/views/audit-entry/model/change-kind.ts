import { isUndefined } from "es-toolkit";

import type { AuditChange } from "@/shared/server";

export type ChangeKind = "added" | "removed" | "changed";

// before가 없으면 추가, after가 없으면 삭제, 둘 다 있으면 변경이다. 목록 칸(added·removed)은 이 판정을 쓰지 않는다.
export function changeKind(change: Pick<AuditChange, "before" | "after">): ChangeKind {
  if (isUndefined(change.before)) return "added";
  if (isUndefined(change.after)) return "removed";
  return "changed";
}
