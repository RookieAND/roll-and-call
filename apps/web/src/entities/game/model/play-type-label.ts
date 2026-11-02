import { PLAY_TYPE_LABEL, type PlayType } from "@roll-and-call/database/games/model";

export function playTypeLabel(playType: PlayType) {
  return PLAY_TYPE_LABEL[playType];
}
