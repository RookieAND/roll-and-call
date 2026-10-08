import { toSeoulDateKey } from "./to-seoul-date-key";

const DAY = 86_400_000;

export function shiftLabel({ from, to }: { from: Date; to: Date }) {
  const days = (Date.parse(toSeoulDateKey(to)) - Date.parse(toSeoulDateKey(from))) / DAY;
  if (days === 0) return null;
  return days > 0 ? `${days}일 연장` : `${-days}일 앞당김`;
}
