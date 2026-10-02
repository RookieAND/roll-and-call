import { Button, Text } from "@roll-and-call/ui";

import { NOTIFY_NOTE } from "../model/notify-note";

interface SkipStatusProps {
  note?: string;
  onSkip: () => void;
}

export function SkipStatus({ note, onSkip }: SkipStatusProps) {
  return (
    <>
      <Button variant="outline" colorPalette="gray" size="sm" onClick={onSkip}>
        건너뛰기
      </Button>
      {note ? (
        <Text typography="body4" weight="bold" foreground="danger">
          {note}
        </Text>
      ) : (
        <Text typography="body4" foreground="hint">
          {NOTIFY_NOTE}
        </Text>
      )}
    </>
  );
}
