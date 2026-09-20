import { Text } from "@trpg/ui";

export function GameDeadlineCount({ label }: { label: string }) {
  return (
    <Text numeric typography="body4" weight="bold" foreground="muted" className="shrink-0">
      {label}
    </Text>
  );
}
