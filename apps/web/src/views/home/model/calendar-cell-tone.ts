export const CALENDAR_CELL_STATE = {
  selected: "selected",
  today: "today",
  picked: "picked",
  plain: "plain",
} as const;

export type CalendarCellState = (typeof CALENDAR_CELL_STATE)[keyof typeof CALENDAR_CELL_STATE];

type CalendarCellTone = {
  cell: string;
  day: string | null;
  dot: string | null;
  pill: string;
  today: string;
};

export const CALENDAR_CELL_TONE: Record<CalendarCellState, CalendarCellTone> = {
  [CALENDAR_CELL_STATE.selected]: {
    cell: "bg-primary-600",
    day: "text-on-primary",
    dot: "bg-on-primary",
    pill: "bg-on-primary/20 text-on-primary",
    today: "text-on-primary",
  },
  [CALENDAR_CELL_STATE.today]: {
    cell: "bg-tinted-bg",
    day: "text-tinted-ink",
    dot: null,
    pill: "bg-gray-100 text-gray-600",
    today: "text-tinted-ink",
  },
  [CALENDAR_CELL_STATE.picked]: {
    cell: "bg-tinted-bg",
    day: null,
    dot: null,
    pill: "bg-gray-100 text-gray-600",
    today: "text-tinted-ink",
  },
  [CALENDAR_CELL_STATE.plain]: {
    cell: "hover:bg-gray-50",
    day: null,
    dot: null,
    pill: "bg-gray-100 text-gray-600",
    today: "text-tinted-ink",
  },
};

// 세션이 없는 날은 골라도 채우지 않고 옅은 바탕만 깐다.
export function calendarCellState({
  selected,
  today,
  hasSessions,
}: {
  selected: boolean;
  today: boolean;
  hasSessions: boolean;
}): CalendarCellState {
  if (selected && hasSessions) return CALENDAR_CELL_STATE.selected;
  if (today) return CALENDAR_CELL_STATE.today;
  return selected ? CALENDAR_CELL_STATE.picked : CALENDAR_CELL_STATE.plain;
}
