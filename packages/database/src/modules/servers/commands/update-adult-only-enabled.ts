import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { recordAudit } from "#db/modules/audit";
import type { Actor } from "#db/modules/audit";
import { servers } from "#db/schema";

const ENABLED_LABEL = { true: "켜짐", false: "꺼짐" } as const;

// 성인 전용 구인 표기를 켜고 끈다. 이미 올라간 구인은 바뀌지 않는다. 값이 그대로면 아무것도 하지 않고 false를 돌려준다.
export async function updateAdultOnlyEnabled({
  serverId,
  enabled,
  actor,
}: {
  serverId: string;
  enabled: boolean;
  actor: Actor;
}): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({ name: servers.name, adultOnlyEnabled: servers.adultOnlyEnabled })
      .from(servers)
      .where(eq(servers.id, serverId))
      .for("update");
    if (!current) throw new Error("서버를 찾을 수 없습니다");
    if (current.adultOnlyEnabled === enabled) return false;
    await tx.update(servers).set({ adultOnlyEnabled: enabled }).where(eq(servers.id, serverId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "서버 설정 변경",
        target: `${current.name} · 성인 전용 구인 표기`,
        reason: `성인 전용 구인 표기를 ${ENABLED_LABEL[`${enabled}`]}으로 변경`,
        before: { label: ENABLED_LABEL[`${current.adultOnlyEnabled}`] },
        after: { label: ENABLED_LABEL[`${enabled}`] },
      },
    });
    return true;
  });
}
