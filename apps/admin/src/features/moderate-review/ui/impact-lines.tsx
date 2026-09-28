import { Callout } from "@roll-and-call/ui";
import { RotateCcw, TriangleAlert } from "lucide-react";

interface ImpactLinesProps {
  lines: [string, string];
  danger: boolean;
}

export function ImpactLines({ lines, danger }: ImpactLinesProps) {
  const [headline, detail] = lines;
  const HeadIcon = danger ? TriangleAlert : RotateCcw;
  const palette = danger ? "danger" : "gray";
  return (
    <Callout.Root colorPalette={palette} size="sm">
      <Callout.Icon>
        <HeadIcon size={14} />
      </Callout.Icon>
      <Callout.Title>{headline}</Callout.Title>
      <Callout.Description>{detail}</Callout.Description>
    </Callout.Root>
  );
}
