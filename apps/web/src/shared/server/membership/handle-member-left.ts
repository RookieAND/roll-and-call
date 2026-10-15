import "server-only";
import type { Server } from "@roll-and-call/database";
import { evaluateGameBadges } from "@roll-and-call/database/badges";
import { leaveServer } from "@roll-and-call/database/servers";
import {
  notifyGameCancelled,
  notifyGameLeft,
  refreshRecruitPost,
} from "@roll-and-call/game-notices";
import { uniq } from "es-toolkit";
import { revalidatePath } from "next/cache";

// 디스코드 서버를 나간 멤버를 정리하고 구인 스레드에 알린다. 이미 처리된 멤버면 아무것도 하지 않는다.
// 화면을 그리는 중에는 revalidatePath를 못 부르므로, 렌더 중인 곳에서는 after() 안에서 부른다.
// 탈퇴는 커밋되면 다시 돌지 않으므로, 뒤따르는 단계는 하나가 실패해도 나머지를 이어 간다.
export async function handleMemberLeft({ server, userId }: { server: Server; userId: string }) {
  const result = await leaveServer({ serverId: server.id, userId });
  if (!result.ok) return false;

  const step = async (label: string, work: () => Promise<unknown>) => {
    try {
      await work();
    } catch (error) {
      console.error(`handleMemberLeft ${label} 실패`, { serverId: server.id, userId, error });
    }
  };

  for (const gameId of result.leftConfirmedGameIds) {
    await step("나감 알림", () =>
      notifyGameLeft({ server, gameId, userId, removedByGm: false, leftServer: true }),
    );
  }
  for (const gameId of uniq(result.leftGameIds)) {
    await step("구인 글", () => refreshRecruitPost({ server, gameId }));
  }
  for (const game of result.cancelledGames) {
    await step("취소 알림", () => notifyGameCancelled({ server, game }));
  }
  for (const gameId of result.autoConfirmedGameIds) {
    await step("칭호", () => evaluateGameBadges({ serverId: server.id, gameId }));
  }
  revalidatePath(`/${server.slug}`, "layout");
  return true;
}
