import { and, eq, isNull, ne, sql } from "drizzle-orm";

import { db } from "#/client";
import { firstFreeNickname, nicknameBaseOf } from "#/modules/servers/model/member-nickname";
import { serverMembers } from "#/schema";

import { lockServerNicknames } from "./lock-server-nicknames";

// 처음 들어오면 멤버로 넣고, 나갔던 사람이면 deleted_at을 지워 예전 프로필을 되살린다.
// 추방되어 차단(banned_at) 중인 사람은 넣지 않고 false를 돌려준다. 차단이 풀리면 일반 재가입이다.
// 닉네임은 처음이면 defaultNickname(디스코드 서버 닉네임), 재가입이면 예전 닉네임이다. 활동 중인 멤버와 겹치면 숫자를 붙인다.
// 이미 활동 중인 멤버십(디스코드 구인글로 미리 만든 프로필 포함)은 닉네임을 건드리지 않는다.
export async function ensureMembership({
  serverId,
  userId,
  defaultNickname,
}: {
  serverId: string;
  userId: string;
  defaultNickname: string;
}) {
  return db.transaction(async (transaction) => {
    await lockServerNicknames({ transaction, serverId });
    const [existing] = await transaction
      .select({
        nickname: serverMembers.nickname,
        deletedAt: serverMembers.deletedAt,
        bannedAt: serverMembers.bannedAt,
      })
      .from(serverMembers)
      .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
    if (existing?.bannedAt) return false;
    if (existing && !existing.deletedAt) return true;

    const activeNicknames = await transaction
      .select({ nickname: serverMembers.nickname })
      .from(serverMembers)
      .where(
        and(
          eq(serverMembers.serverId, serverId),
          isNull(serverMembers.deletedAt),
          ne(serverMembers.userId, userId),
        ),
      );
    const base = existing?.nickname ?? nicknameBaseOf(defaultNickname) ?? "user";
    const { nickname, suffixed } = firstFreeNickname({
      base,
      taken: new Set(activeNicknames.map((member) => member.nickname.toLowerCase())),
    });

    if (existing) {
      // 숫자를 새로 붙이지 않았으면 나가기 전의 표시(nickname_suffix_base)를 그대로 둔다.
      await transaction
        .update(serverMembers)
        .set({
          nickname,
          ...(suffixed && { nicknameSuffixBase: base }),
          deletedAt: null,
          rejoinedAt: sql`now()`,
        })
        .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
    } else {
      await transaction
        .insert(serverMembers)
        .values({ serverId, userId, nickname, nicknameSuffixBase: suffixed ? base : null });
    }
    return true;
  });
}
