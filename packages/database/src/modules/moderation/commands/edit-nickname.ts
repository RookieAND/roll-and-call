import { and, eq, ne } from "drizzle-orm";

import { db } from "../../../client";
import { profiles } from "../../../schema";
import type { Actor } from "../model/types";
import { recordAudit } from "./record-audit";

export type EditNicknameResult =
  | { ok: true }
  | { ok: false; taken: true }
  | { ok: false; conflict: { from: string; to: string } };

// 닉네임은 계정 전역 값이라 모든 서버에 함께 바뀐다. 운영진이 보던 닉네임(expected)에서 그사이 사용자가 바꿨으면 아무것도 바꾸지 않는다.
// 이전 닉네임은 활동 기록(before·after)에 남겨 상세 화면과 유저 검색이 읽는다.
export async function editNickname({
  serverId,
  userId,
  actor,
  input,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  input: {
    expected: string;
    nickname: string;
    reason: string;
    reasonTag: string;
    staffMemo: string;
  };
}): Promise<EditNicknameResult> {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({ username: profiles.username })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .for("update");
    if (!current) throw new Error("유저를 찾을 수 없습니다");
    if (current.username !== input.expected) {
      return { ok: false, conflict: { from: input.expected, to: current.username } };
    }
    const [other] = await tx
      .select({ id: profiles.id })
      .from(profiles)
      .where(and(eq(profiles.username, input.nickname), ne(profiles.id, userId)))
      .limit(1);
    if (other) return { ok: false, taken: true };

    await tx.update(profiles).set({ username: input.nickname }).where(eq(profiles.id, userId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "닉네임 수정",
        target: input.expected,
        targetUserId: userId,
        reason: input.reason,
        reasonTag: input.reasonTag,
        staffMemo: input.staffMemo || undefined,
        before: { label: input.expected },
        after: { label: input.nickname },
      },
    });
    return { ok: true };
  });
}
