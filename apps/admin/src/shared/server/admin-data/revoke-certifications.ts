import "server-only";
import { applyOngoingChoices, type OngoingChoice } from "./apply-ongoing-choices";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";

export interface RevokeInput {
  rulebooks: string[];
  userReason: string;
  staffMemo: string;
  ongoing: OngoingChoice[];
}

// 고른 룰북의 인증을 한 번에 취소하고 활동 기록은 한 건만 남긴다.
export async function revokeCertifications(userId: string, actor: string, input: RevokeInput) {
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  const revoked = db.certifications.filter(
    (item) => item.userId === userId && input.rulebooks.includes(item.rulebook),
  );
  if (revoked.length === 0) return { ok: false as const, alreadyRevoked: true as const };
  db.certifications = db.certifications.filter((item) => !revoked.includes(item));
  applyOngoingChoices(userId, input.ongoing);
  recordAudit({
    actor,
    action: "인증 취소",
    target: `${user.nickname} · ${revoked.map((item) => item.rulebook).join(", ")}`,
    reason: input.userReason,
    staffMemo: input.staffMemo || undefined,
  });
  return { ok: true as const };
}
