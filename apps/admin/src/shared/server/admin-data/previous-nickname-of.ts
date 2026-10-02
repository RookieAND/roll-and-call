import type { AuditEntry } from "./types";

// 마지막 닉네임 수정이 지금 닉네임을 만든 경우에만 이전 닉네임을 보인다. 그 뒤에 사용자가 직접 바꿨으면 보이지 않는다.
export function previousNicknameOf({
  auditLog,
  userId,
  nickname,
}: {
  auditLog: AuditEntry[];
  userId: string;
  nickname: string;
}) {
  const latest = auditLog.find(
    (entry) => entry.action === "닉네임 수정" && entry.targetUserId === userId,
  );
  if (!latest?.before || latest.after?.label !== nickname) return null;
  return { nickname: latest.before.label, at: latest.at };
}
