import { isUndefined } from "es-toolkit";
interface TabCountProps {
  count: number | undefined;
}

export function TabCount({ count }: TabCountProps) {
  if (isUndefined(count)) return null;
  return <span className="tabular-nums opacity-72">{count}</span>;
}
