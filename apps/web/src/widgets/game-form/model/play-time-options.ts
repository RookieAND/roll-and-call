import { range } from "es-toolkit";

export const MAX_PLAY_HOURS = 12;

export const PLAY_HOUR_OPTIONS = range(MAX_PLAY_HOURS + 1);

export const PLAY_MINUTE_OPTIONS = [0, 10, 20, 30, 40, 50] as const;
