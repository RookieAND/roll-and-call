import { sendIntegrationEvent } from "../core";
import { CANVAS_SOURCE, type CanvasEventDataMap, type CanvasEventType } from "./canvas-events";
import { canvasTarget } from "./canvas-target";

// 연동이 꺼져 있으면 조용히 넘어가고, 실패해도 부른 쪽 작업은 막지 않고 로그만 남긴다.
export async function sendCanvasEvent<Type extends CanvasEventType>({
  type,
  id,
  data,
}: {
  type: Type;
  id: string;
  data: CanvasEventDataMap[Type];
}) {
  const target = canvasTarget();
  if (!target) return;
  const result = await sendIntegrationEvent({ target, source: CANVAS_SOURCE, type, id, data });
  if (!result.ok) console.warn("Canvas 연동 실패", type, id, result.error);
}
