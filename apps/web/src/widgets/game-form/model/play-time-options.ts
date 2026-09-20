export const DEFAULT_PLAY_TIME = "3시간";

export const MAX_PLAY_HOURS = 12;

export const PLAY_HOUR_OPTIONS = Array.from({ length: MAX_PLAY_HOURS + 1 }, (_, index) => index);

export const PLAY_MINUTE_OPTIONS = [0, 10, 20, 30, 40, 50] as const;
