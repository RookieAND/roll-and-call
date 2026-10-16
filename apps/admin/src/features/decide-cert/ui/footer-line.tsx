import { Button, Text } from "@roll-and-call/ui";

import type { FooterNote } from "../model/footer-note";
import { NOTIFY_NOTE } from "../model/notify-note";

interface FooterLineProps {
  note?: FooterNote;
  onNoteClick: (note: FooterNote) => void;
}

// 버튼 위 한 줄: 막힌 이유(누르면 그 자리로 이동)가 없으면 알림 안내다.
export function FooterLine({ note, onNoteClick }: FooterLineProps) {
  if (!note) {
    return (
      <Text typography="body4" foreground="hint" className="text-center">
        {NOTIFY_NOTE}
      </Text>
    );
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      colorPalette="danger"
      onClick={() => onNoteClick(note)}
      className="h-auto min-h-10 w-full justify-center px-0 py-0 text-center font-bold whitespace-normal"
    >
      {note.text}
    </Button>
  );
}
