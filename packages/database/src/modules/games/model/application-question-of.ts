import type { Game } from "#db/schema/games";

import { APPLICATION_QUESTION_DEFAULT } from "./application-question";

// 신청글 받기 구인이면 신청자에게 보일 질문, 아니면 null.
export function applicationQuestionOf(
  game: Pick<Game, "applicationNoteEnabled" | "applicationQuestion">,
): string | null {
  if (!game.applicationNoteEnabled) return null;
  return game.applicationQuestion ?? APPLICATION_QUESTION_DEFAULT;
}
