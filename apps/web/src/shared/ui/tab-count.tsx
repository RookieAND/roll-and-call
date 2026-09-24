interface TabCountProps {
  count: number | undefined;
}

export function TabCount({ count }: TabCountProps) {
  if (count === undefined) return null;
  return <span className="tabular-nums opacity-72">{count}</span>;
}
