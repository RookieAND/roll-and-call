import { Button } from "@roll-and-call/ui";

import { DisabledTooltip } from "@/shared/ui";

interface FlagButtonProps {
  flagged: boolean;
  locked: boolean;
  lockedNote: string;
  onToggle: () => void;
}

export function FlagButton({ flagged, locked, lockedNote, onToggle }: FlagButtonProps) {
  const button = (
    <Button
      size="sm"
      variant={flagged ? "tinted" : "outline"}
      colorPalette={flagged ? "danger" : "gray"}
      aria-pressed={flagged}
      disabled={locked}
      onClick={onToggle}
    >
      문제 지정
    </Button>
  );
  if (!locked) return button;
  return <DisabledTooltip note={lockedNote}>{button}</DisabledTooltip>;
}
