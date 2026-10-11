"use server";

import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireOwner, updateRankingMode } from "@/shared/server";

const schema = z.object({
  rankingMode: z.enum([RANKING_MODE.count, RANKING_MODE.points]) satisfies z.ZodType<RankingMode>,
});

// 서버 설정을 바꿀 수 있는 소유자만 바꾼다(D407). 저장하는 즉시 그 달 전체가 새 방식으로 계산된다.
export async function saveRankingMode(args: { rankingMode: RankingMode }) {
  const actor = await requireOwner();
  const { rankingMode } = parseActionInput(schema, args);
  const server = await getCurrentServer();
  await updateRankingMode({ serverId: server.id, mode: rankingMode, actor });
  revalidatePath("/", "layout");
}
