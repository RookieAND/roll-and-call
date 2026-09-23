import { Card, Text } from "@roll-and-call/ui";

interface AttendanceStatProps {
  label: string;
  count: number;
  danger?: boolean;
}

export function AttendanceStat({ label, count, danger = false }: AttendanceStatProps) {
  const countForeground = danger ? "danger" : "normal";

  return (
    <Card.Root radius={500} padding="sm">
      <Text typography="body4" foreground="hint" render={<p />}>
        {label}
      </Text>
      <Text
        numeric
        typography="heading2"
        foreground={countForeground}
        render={<p />}
        className="mt-050"
      >
        {count}명
      </Text>
    </Card.Root>
  );
}
