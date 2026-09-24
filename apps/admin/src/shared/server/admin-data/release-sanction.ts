import "server-only";
import { isSanctioned } from "./is-sanctioned";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";

export type ReleaseResult = { ok: true } | { ok: false; alreadyReleased: true };

export async function releaseSanction(
  userId: string,
  actor: string,
  input: { userReason: string; staffMemo: string },
): Promise<ReleaseResult> {
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  if (!isSanctioned(user)) return { ok: false, alreadyReleased: true };
  user.sanction = undefined;
  recordAudit({
    actor,
    action: "제재 해제",
    target: user.nickname,
    reason: input.userReason,
    staffMemo: input.staffMemo || undefined,
  });
  return { ok: true };
}
