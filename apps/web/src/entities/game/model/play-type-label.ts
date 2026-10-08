import { PLAY_TYPE, type PlayType } from "./play-type";

export function playTypeLabel(playType: PlayType) {
  return playType === PLAY_TYPE.text ? "텍스트" : "보이스";
}
