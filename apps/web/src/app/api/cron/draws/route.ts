import { drawLottery, listDueLotteries } from "@roll-and-call/database/games";
import { DRAW_RESULT_KIND } from "@roll-and-call/database/games/model";
import { getServerById } from "@roll-and-call/database/servers";
import { withTransaction } from "@roll-and-call/database/transaction";

import { finishLotteryDraw, isCronRequest } from "@/shared/server";

export const maxDuration = 60;

// pg_cron draw-lotteries가 10분마다, 추첨할 글이 있을 때만 부른다(0060). 마감이 지난 추첨 글을 GM 버튼과 같은 명령으로 추첨한다.
// 이미 추첨된 글은 명령이 already_drawn으로 돌려주니 skipped로 센다.
export async function POST(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const now = new Date();
  const { due, stuck } = await listDueLotteries({ now });
  if (stuck > 0) console.error(`draw-lotteries: 신청이 닫혀 추첨하지 못한 글 ${stuck}개`);

  const counts = { drawn: 0, confirmedAll: 0, empty: 0, skipped: 0, failed: 0 };
  for (const { id: gameId, serverId } of due) {
    try {
      const server = await getServerById(serverId);
      if (!server) {
        counts.skipped += 1;
        continue;
      }
      const result = await withTransaction((transaction) =>
        drawLottery({ transaction, serverId, gameId, actorId: null, now: new Date() }),
      );
      if (result.kind === DRAW_RESULT_KIND.rejected) {
        counts.skipped += 1;
        continue;
      }
      counts[result.kind] += 1;
      await finishLotteryDraw({ server, gameId, result });
    } catch (error) {
      counts.failed += 1;
      console.error("draw-lotteries 실패", { gameId, error });
    }
  }
  return Response.json({ ok: true, ...counts, stuck });
}
