import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "#/client";
import type { NicknameSyncChange } from "#/modules/servers/model/plan-nickname-sync";
import { serverMembers } from "#/schema";

import { lockServerNicknames } from "./lock-server-nicknames";

// planNicknameSync 결과를 한 트랜잭션으로 쓴다. 서로 이름을 맞바꾸는 경우 유니크 인덱스에 걸리지 않게
// 바뀌는 행을 먼저 임시 값(~user_id)으로 비운 뒤 최종 값을 쓴다. profiles.username은 건드리지 않는다.
export async function applyNicknameSync({
  serverId,
  changes,
}: {
  serverId: string;
  changes: NicknameSyncChange[];
}) {
  if (changes.length === 0) return;
  await db.transaction(async (transaction) => {
    await lockServerNicknames({ transaction, serverId });
    await transaction
      .update(serverMembers)
      .set({ nickname: sql`'~' || ${serverMembers.userId}` })
      .where(
        and(
          eq(serverMembers.serverId, serverId),
          inArray(
            serverMembers.userId,
            changes.map((change) => change.userId),
          ),
        ),
      );
    for (const change of changes) {
      await transaction
        .update(serverMembers)
        .set({ nickname: change.to, nicknameSuffixBase: change.suffixBase })
        .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, change.userId)));
    }
  });
}
