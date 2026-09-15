import { GAME_NOT_FOUND_MESSAGE } from "./action-messages";
import type { ActionResult } from "./action-result";
import { ERROR_DISPLAY } from "./error-display";

export const GAME_NOT_FOUND_RESULT = {
  error: GAME_NOT_FOUND_MESSAGE,
  errorDisplay: ERROR_DISPLAY.page,
} as const satisfies ActionResult;
