import { getDiscordId } from "@roll-and-call/database/profiles";

import { CANVAS_EVENT_TYPE } from "./canvas-events";
import { CANVAS_SLUG } from "./canvas-target";
import { sendCanvasEvent } from "./send-canvas-event";

// 참석자 후기가 새로 올라오면 Canvas가 작성자와 GM에게 포인트를 준다. GM이 쓴 마스터링 후기는 부르지 않는다.
export async function notifyCanvasReview({
  server,
  reviewId,
  gameTitle,
  authorId,
  gmId,
}: {
  server: { slug: string };
  reviewId: string;
  gameTitle: string;
  authorId: string;
  gmId: string;
}) {
  if (server.slug !== CANVAS_SLUG) return;
  const [authorDiscordId, gmDiscordId] = await Promise.all([
    getDiscordId(authorId),
    getDiscordId(gmId),
  ]);
  if (!authorDiscordId || !gmDiscordId) return;
  await sendCanvasEvent({
    type: CANVAS_EVENT_TYPE.reviewWritten,
    id: `${CANVAS_EVENT_TYPE.reviewWritten}:${reviewId}`,
    data: { reviewId, gameTitle, authorDiscordId, gmDiscordId },
  });
}
