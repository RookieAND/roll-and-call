import { Button, Text } from "@roll-and-call/ui";

import type { FooterNote } from "../model/footer-note";
import { NOTIFY_NOTE } from "../model/notify-note";

interface SkipStatusProps {
  note?: FooterNote;
  onSkip: () => void;
  onNoteClick?: (note: FooterNote) => void;
}

export function SkipStatus({ note, onSkip, onNoteClick }: SkipStatusProps) {
  return (
    <>
      <Button variant="outline" colorPalette="gray" size="sm" onClick={onSkip}>
        건너뛰기
      </Button>
      {note ? (
        <Button
          variant="ghost"
          size="sm"
          colorPalette="danger"
          className="min-w-0 font-bold"
          onClick={() => onNoteClick?.(note)}
        >
          {note.text}
        </Button>
      ) : (
        <Text typography="body4" foreground="hint">
          {NOTIFY_NOTE}
        </Text>
      )}
    </>
  );
}
