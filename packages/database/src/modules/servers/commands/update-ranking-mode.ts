import { eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { servers } from "#/schema";

import { RANKING_MODE_LABEL, type RankingMode } from "../model/ranking-mode";

// 이 달의 기록 방식을 바꾼다(D407). 점수는 저장하지 않고 기록에서 계산하므로 저장하는 즉시 그 달 전체가 새 방식으로 계산된다.
// 활동 기록 「서버 설정 변경」 한 건에 전후 값을 남긴다. 값이 그대로면 아무것도 하지 않고 false를 돌려준다.
export async function updateRankingMode({
  serverId,
  mode,
  actor,
}: {
  serverId: string;
  mode: RankingMode;
  actor: Actor;
}): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({ name: servers.name, rankingMode: servers.rankingMode })
      .from(servers)
      .where(eq(servers.id, serverId))
      .for("update");
    if (!current) throw new Error("서버를 찾을 수 없습니다");
    if (current.rankingMode === mode) return false;
    await tx.update(servers).set({ rankingMode: mode }).where(eq(servers.id, serverId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "서버 설정 변경",
        target: `${current.name} · 이 달의 기록 방식`,
        reason: `이 달의 기록 방식을 ${RANKING_MODE_LABEL[mode]}로 변경`,
        before: { label: RANKING_MODE_LABEL[current.rankingMode as RankingMode] },
        after: { label: RANKING_MODE_LABEL[mode] },
      },
    });
    return true;
  });
}
