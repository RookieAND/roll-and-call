import type { AuditEntry } from "./types";

// 운영진이 닉네임을 바꾸면 활동 기록의 before에 바꾸기 전 닉네임이 남는다.
export function previousNicknamesOf({
  auditLog,
  userId,
}: {
  auditLog: AuditEntry[];
  userId: string;
}) {
  return auditLog.flatMap((entry) =>
    entry.action === "닉네임 수정" && entry.targetUserId === userId && entry.before
      ? [entry.before.label]
      : [],
  );
}
