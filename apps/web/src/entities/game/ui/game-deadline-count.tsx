import { Text } from "@trpg/ui";

interface GameDeadlineCountProps {
  label: string;
}

export function GameDeadlineCount({ label }: GameDeadlineCountProps) {
  return (
    <Text numeric typography="body4" weight="bold" foreground="muted" className="shrink-0">
      {label}
    </Text>
  );
}
