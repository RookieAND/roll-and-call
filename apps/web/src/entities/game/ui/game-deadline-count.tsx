import { Text } from "@roll-and-call/ui";

interface GameDeadlineCountProps {
  label: string;
}

export function GameDeadlineCount({ label }: GameDeadlineCountProps) {
  return (
    <Text numeric typography="body4" weight="bold" foreground="hint" className="shrink-0">
      {label}
    </Text>
  );
}
