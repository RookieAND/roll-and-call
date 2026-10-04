import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import type { Actor } from "#/modules/moderation/model/types";
import { isNicknameTaken } from "#/modules/profiles/queries/is-nickname-taken";
import { isUniqueViolation } from "#/modules/transaction/is-unique-violation";
import { profiles, serverMembers } from "#/schema";

import { recordAudit } from "./record-audit";

export type EditNicknameResult =
  | { ok: true }
  | { ok: false; taken: true }
  | { ok: false; conflict: { from: string; to: string } };

// 그 서버의 닉네임만 바꾼다. 운영진이 보던 닉네임(expected)에서 그사이 사용자가 바꿨으면 아무것도 바꾸지 않는다.
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
  const memberOf = and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId));
  try {
    return await db.transaction(async (tx) => {
      const [current] = await tx
        .select({ nickname: serverMembers.nickname })
        .from(serverMembers)
        .where(memberOf)
        .for("update");
      if (!current) throw new Error("유저를 찾을 수 없습니다");
      if (current.nickname !== input.expected) {
        return { ok: false, conflict: { from: input.expected, to: current.nickname } };
      }
      if (await isNicknameTaken({ transaction: tx, serverId, userId, nickname: input.nickname })) {
        return { ok: false, taken: true };
      }

      await tx
        .update(serverMembers)
        .set({ nickname: input.nickname, nicknameSuffixBase: null })
        .where(memberOf);
      // 이중 쓰기. C01 작업 5에서 지운다.
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
  } catch (error) {
    if (isUniqueViolation(error, "server_members_active_nickname_uq")) {
      return { ok: false, taken: true };
    }
    throw error;
  }
}
