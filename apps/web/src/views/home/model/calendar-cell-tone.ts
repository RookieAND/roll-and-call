export const CALENDAR_CELL_STATE = {
  selected: "selected",
  today: "today",
  plain: "plain",
} as const;

export type CalendarCellState = (typeof CALENDAR_CELL_STATE)[keyof typeof CALENDAR_CELL_STATE];

type CalendarCellTone = {
  cell: string;
  // null이면 요일·이번 달 여부가 색을 정한다.
  day: string | null;
  // null이면 내가 참여하는 세션인지가 색을 정한다.
  preview: string | null;
  rest: string;
  today: string;
};

export const CALENDAR_CELL_TONE: Record<CalendarCellState, CalendarCellTone> = {
  [CALENDAR_CELL_STATE.selected]: {
    cell: "bg-primary-600",
    day: "text-white",
    preview: "bg-white/20 text-white",
    rest: "text-white/80",
    today: "text-white",
  },
  [CALENDAR_CELL_STATE.today]: {
    cell: "bg-tinted-bg",
    day: "text-primary-ink",
    preview: null,
    rest: "text-hint",
    today: "text-primary-ink",
  },
  [CALENDAR_CELL_STATE.plain]: {
    cell: "hover:bg-gray-50",
    day: null,
    preview: null,
    rest: "text-hint",
    today: "text-primary-ink",
  },
};

export function calendarCellState(selected: boolean, today: boolean): CalendarCellState {
  if (selected) return CALENDAR_CELL_STATE.selected;
  return today ? CALENDAR_CELL_STATE.today : CALENDAR_CELL_STATE.plain;
}
