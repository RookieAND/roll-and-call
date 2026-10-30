// Canvas가 받는 이벤트와 데이터 모양. Canvas가 포인트·역할 규칙을 정하고 R&C는 사실만 알린다.
// 받는 쪽: canvas-discord-bot/apps/admin/src/server/integrations/rnc/rnc-event-data.ts
export const CANVAS_SOURCE = "roll-and-call";

export const CANVAS_EVENT_TYPE = {
  certGranted: "cert.granted",
  gameStarted: "game.started",
  reviewWritten: "review.written",
} as const;

export interface CanvasCertGrantedData {
  discordId: string;
}

export interface CanvasGameStartedData {
  gameId: string;
  gameTitle: string;
  gmDiscordId: string;
  participantDiscordIds: string[];
  miniRule: boolean;
}

export interface CanvasReviewWrittenData {
  reviewId: string;
  gameTitle: string;
  authorDiscordId: string;
  gmDiscordId: string;
}

export interface CanvasEventDataMap {
  [CANVAS_EVENT_TYPE.certGranted]: CanvasCertGrantedData;
  [CANVAS_EVENT_TYPE.gameStarted]: CanvasGameStartedData;
  [CANVAS_EVENT_TYPE.reviewWritten]: CanvasReviewWrittenData;
}

export type CanvasEventType = keyof CanvasEventDataMap;
