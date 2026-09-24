import "server-only";
import { db } from "@roll-and-call/database";

import { isSanctioned } from "./is-sanctioned";
import { recordAudit } from "./record-audit";
import { loadSnapshot } from "./snapshot";
import type { Actor } from "./types";

// ponytail: 실제 디스코드 DM은 보내지 않고 활동 기록만 남긴다. 봇 DM을 붙일 곳이 여기다.
export async function sendCertGuideDm(userId: string, actor: Actor) {
  const snapshot = await loadSnapshot();
  const user = snapshot.users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  if (isSanctioned(user)) {
    return { ok: false as const, error: "제재 중인 사용자에게는 안내 DM을 보낼 수 없습니다." };
  }
  await recordAudit(db, actor, {
    action: "안내 DM",
    target: user.nickname,
    targetUserId: userId,
    reason: "룰북 인증 안내",
  });
  return { ok: true as const };
}
