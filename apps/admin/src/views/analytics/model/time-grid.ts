export const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

export const TIME_SLOTS = [
  { label: "오전" },
  { label: "12–15시", start: 12, end: 15 },
  { label: "15–18시", start: 15, end: 18 },
  { label: "18–20시", start: 18, end: 20 },
  { label: "20–22시", start: 20, end: 22 },
  { label: "22–24시", start: 22, end: 24 },
  { label: "0시 이후" },
] as const;
