export const SEAT_TONE = {
  method: "method",
  strong: "strong",
  plain: "plain",
} as const;

export type SeatTone = (typeof SEAT_TONE)[keyof typeof SEAT_TONE];
