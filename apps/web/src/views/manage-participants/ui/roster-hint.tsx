import { Text } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface RosterHintProps {
  lines: readonly string[];
}

export function RosterHint({ lines }: RosterHintProps) {
  if (lines.length === 0) return null;
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      <LineBreaks lines={lines} />
    </Text>
  );
}
