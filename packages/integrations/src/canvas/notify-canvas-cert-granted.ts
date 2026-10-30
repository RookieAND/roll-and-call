import { getDiscordId } from "@roll-and-call/database/profiles";

import { CANVAS_EVENT_TYPE } from "./canvas-events";
import { CANVAS_SLUG } from "./canvas-target";
import { sendCanvasEvent } from "./send-canvas-event";

// 룰북 인증을 받은 사람에게 Canvas가 GM 역할을 준다.
export async function notifyCanvasCertGranted({
  server,
  userIds,
}: {
  server: { slug: string };
  userIds: string[];
}) {
  if (server.slug !== CANVAS_SLUG) return;
  for (const userId of userIds) {
    const discordId = await getDiscordId(userId);
    if (!discordId) continue;
    await sendCanvasEvent({
      type: CANVAS_EVENT_TYPE.certGranted,
      id: `${CANVAS_EVENT_TYPE.certGranted}:${userId}:${Date.now()}`,
      data: { discordId },
    });
  }
}
