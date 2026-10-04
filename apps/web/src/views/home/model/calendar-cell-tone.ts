export const CALENDAR_CELL_STATE = {
  selected: "selected",
  today: "today",
  plain: "plain",
} as const;

export type CalendarCellState = (typeof CALENDAR_CELL_STATE)[keyof typeof CALENDAR_CELL_STATE];

type CalendarCellTone = {
  cell: string;
  day: string | null;
  dot: string | null;
  more: string;
  chip: string | null;
  pill: string;
  today: string;
};

export const CALENDAR_CELL_TONE: Record<CalendarCellState, CalendarCellTone> = {
  [CALENDAR_CELL_STATE.selected]: {
    cell: "bg-primary-600",
    day: "text-on-primary",
    dot: "bg-on-primary",
    more: "text-on-primary",
    chip: "bg-on-primary/20 text-on-primary",
    pill: "bg-on-primary/20 text-on-primary",
    today: "text-on-primary",
  },
  [CALENDAR_CELL_STATE.today]: {
    cell: "bg-tinted-bg",
    day: "text-tinted-ink",
    dot: null,
    more: "text-hint",
    chip: null,
    pill: "bg-gray-100 text-gray-600",
    today: "text-tinted-ink",
  },
  [CALENDAR_CELL_STATE.plain]: {
    cell: "hover:bg-gray-50",
    day: null,
    dot: null,
    more: "text-hint",
    chip: null,
    pill: "bg-gray-100 text-gray-600",
    today: "text-tinted-ink",
  },
};

export function calendarCellState({
  selected,
  today,
}: {
  selected: boolean;
  today: boolean;
}): CalendarCellState {
  if (selected) return CALENDAR_CELL_STATE.selected;
  return today ? CALENDAR_CELL_STATE.today : CALENDAR_CELL_STATE.plain;
}
