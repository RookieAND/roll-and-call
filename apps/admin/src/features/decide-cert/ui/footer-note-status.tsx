import { Button, Text } from "@roll-and-call/ui";

import type { FooterNote } from "../model/footer-note";

interface FooterNoteStatusProps {
  note: FooterNote;
  onNoteClick?: (note: FooterNote) => void;
}

// 풀 수 있는 이유(target)는 눌러서 그 자리로 이동하고, 상태 안내는 글자만 보인다.
export function FooterNoteStatus({ note, onNoteClick }: FooterNoteStatusProps) {
  if (!note.target) {
    return (
      <Text typography="body4" weight="bold" foreground="muted">
        {note.text}
      </Text>
    );
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      colorPalette="danger"
      className="min-w-0 font-bold"
      onClick={() => onNoteClick?.(note)}
    >
      {note.text}
    </Button>
  );
}
