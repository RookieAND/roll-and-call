import { Button, Text } from "@roll-and-call/ui";

import { DisabledTooltip } from "@/shared/ui";

import type { FooterNote } from "../model/footer-note";
import { NOTIFY_NOTE } from "../model/notify-note";
import { FooterNoteStatus } from "./footer-note-status";

interface SkipStatusProps {
  note?: FooterNote;
  // 마지막 건이면 건너뛸 다음 건이 없다.
  skipDisabled: boolean;
  onSkip: () => void;
  onNoteClick?: (note: FooterNote) => void;
}

export function SkipStatus({ note, skipDisabled, onSkip, onNoteClick }: SkipStatusProps) {
  const skip = (
    <Button
      variant="outline"
      colorPalette="gray"
      size="sm"
      disabled={skipDisabled}
      onClick={onSkip}
    >
      건너뛰기
    </Button>
  );
  return (
    <>
      {skipDisabled ? (
        <DisabledTooltip note="마지막 건이라 건너뛸 다음 건이 없습니다">{skip}</DisabledTooltip>
      ) : (
        skip
      )}
      {note ? (
        <FooterNoteStatus note={note} onNoteClick={onNoteClick} />
      ) : (
        <Text typography="body4" foreground="hint">
          {NOTIFY_NOTE}
        </Text>
      )}
    </>
  );
}
