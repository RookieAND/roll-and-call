import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { isNicknameTaken } from "#/modules/profiles/queries/is-nickname-taken";
import { isUniqueViolation } from "#/modules/transaction/is-unique-violation";
import type { Transaction } from "#/modules/transaction/transaction";
import { profiles, serverMembers } from "#/schema";

export type SaveMemberNicknameResult = { ok: true } | { ok: false; taken: true };

// 그 서버의 닉네임만 바꾼다. keepSuffixNotice가 아니면 숫자가 붙었다는 표시(nickname_suffix_base)를 비운다.
// 바깥 트랜잭션 안에서 불려도 중복 오류가 바깥을 깨뜨리지 않게 savepoint로 감싼다.
export async function saveMemberNickname({
  transaction,
  serverId,
  userId,
  nickname,
  keepSuffixNotice = false,
}: {
  transaction?: Transaction;
  serverId: string;
  userId: string;
  nickname: string;
  keepSuffixNotice?: boolean;
}): Promise<SaveMemberNicknameResult> {
  try {
    return await (transaction ?? db).transaction(async (savepoint) => {
      if (await isNicknameTaken({ transaction: savepoint, serverId, userId, nickname })) {
        return { ok: false, taken: true };
      }
      await savepoint
        .update(serverMembers)
        .set(keepSuffixNotice ? { nickname } : { nickname, nicknameSuffixBase: null })
        .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
      // 이중 쓰기. C01 작업 5에서 지운다.
      await savepoint.update(profiles).set({ username: nickname }).where(eq(profiles.id, userId));
      return { ok: true };
    });
  } catch (error) {
    if (isUniqueViolation(error, "server_members_active_nickname_uq")) {
      return { ok: false, taken: true };
    }
    throw error;
  }
}
