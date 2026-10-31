import { getGameForCanvasStart } from "@roll-and-call/database/games";

import { CANVAS_EVENT_TYPE } from "./canvas-events";
import { CANVAS_SLUG } from "./canvas-target";
import { sendCanvasEvent } from "./send-canvas-event";

// 구인이 시작되면 Canvas가 GM과 확정 참여자에게 포인트를 준다. 공개 구인은 디스코드 시작 안내 쪽(session-reminders)에서 같은 이벤트를 보내고,
// 비공개 구인은 스레드가 없어 이 함수가 웹 크론에서 보낸다. 같은 구인은 Canvas가 한 번만 지급한다.
export async function notifyCanvasGameStarted({ gameId }: { gameId: string }) {
  const game = await getGameForCanvasStart(gameId);
  if (!game || game.serverSlug !== CANVAS_SLUG) return;
  await sendCanvasEvent({
    type: CANVAS_EVENT_TYPE.gameStarted,
    id: `${CANVAS_EVENT_TYPE.gameStarted}:${gameId}`,
    data: {
      gameId,
      gameTitle: game.gameTitle,
      gmDiscordId: game.gmDiscordId,
      participantDiscordIds: game.participantDiscordIds,
      miniRule: game.miniRule,
    },
  });
}
