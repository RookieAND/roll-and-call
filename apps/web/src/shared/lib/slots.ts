// ponytail: fixed daily window (12:00–24:00) at 30-min steps. Add per-game
// hour columns to the schema only if configurable windows are actually needed.
export const SLOT_MINUTES = 30;
export const DAY_START_HOUR = 12;
export const DAY_END_HOUR = 24;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n: number) => String(n).padStart(2, "0");

export type DayColumn = { date: string; label: string; dow: string; md: string };
export type TimeRow = { hour: number; minute: number; label: string };

export function buildDayColumns(
  rangeStart: string,
  rangeEnd: string,
): DayColumn[] {
  const [ys, ms, ds] = rangeStart.split("-").map(Number);
  const [ye, me, de] = rangeEnd.split("-").map(Number);
  const cur = new Date(Date.UTC(ys!, ms! - 1, ds!));
  const last = new Date(Date.UTC(ye!, me! - 1, de!));
  const cols: DayColumn[] = [];
  while (cur.getTime() <= last.getTime()) {
    const mo = cur.getUTCMonth() + 1;
    const d = cur.getUTCDate();
    const dow = WEEKDAYS[cur.getUTCDay()]!;
    const md = `${mo}/${d}`;
    cols.push({
      date: `${cur.getUTCFullYear()}-${pad(mo)}-${pad(d)}`,
      label: `${md}(${dow})`,
      dow,
      md,
    });
    cur.setUTCDate(cur.getUTCDate() + 1);
    if (cols.length > 60) break; // guard against absurd ranges
  }
  return cols;
}

// Overlap heat palette (0→5+) — 시안 uses saturation steps, not a green ramp.
export const HEAT_LIGHT = [
  "#FFFFFF",
  "#EDEEFC",
  "#D8DAFA",
  "#B7BAF5",
  "#8E92EF",
  "#5B60E4",
] as const;

export function heatColor(count: number): string {
  return HEAT_LIGHT[Math.min(5, Math.max(0, count))]!;
}

// Count label reads white once the cell is dark enough, else the deep indigo.
export function heatTextColor(count: number): string {
  return count >= 3 ? "#FFFFFF" : "#5B60E4";
}

export function buildTimeRows(): TimeRow[] {
  const rows: TimeRow[] = [];
  for (let h = DAY_START_HOUR; h < DAY_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      rows.push({ hour: h, minute: m, label: `${pad(h)}:${pad(m)}` });
    }
  }
  return rows;
}

// Canonical UTC ISO for a KST wall-clock slot — consistent on read and write
// regardless of the server timezone.
export function slotIso(date: string, hour: number, minute: number): string {
  return new Date(`${date}T${pad(hour)}:${pad(minute)}:00+09:00`).toISOString();
}
