import { SEAT_TONE, type SeatTone } from "../model/seat-tone";

export const SEAT_CELL_CLASS: Record<SeatTone, string> = {
  [SEAT_TONE.method]: "font-semibold text-hint",
  [SEAT_TONE.strong]: "border-l border-gray-200 font-extrabold text-gray-900",
  [SEAT_TONE.plain]: "border-l border-gray-200 font-semibold text-gray-600",
};
