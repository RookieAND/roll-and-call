import { Button, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

interface ApplicationNoteQuoteProps {
  username: string;
  note: string;
  onClick: () => void;
}

export function ApplicationNoteQuote({ username, note, onClick }: ApplicationNoteQuoteProps) {
  return (
    <Button
      variant="ghost"
      colorPalette="gray"
      aria-label={`${username}님의 신청글 열기`}
      onClick={onClick}
      className="h-auto min-h-11 w-full justify-start gap-100 rounded-400 bg-gray-100 px-150 py-150 text-left font-normal"
    >
      <Text typography="body4" className="line-clamp-2 min-w-0 flex-1 whitespace-pre-line">
        {note}
      </Text>
      <ChevronRight size={16} aria-hidden className="shrink-0 text-hint" />
    </Button>
  );
}
