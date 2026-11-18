import { Text } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface RoundHintProps {
  lines: readonly string[];
}

export function RoundHint({ lines }: RoundHintProps) {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      <LineBreaks lines={[...lines]} />
    </Text>
  );
}
