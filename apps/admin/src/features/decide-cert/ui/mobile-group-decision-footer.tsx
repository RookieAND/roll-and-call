import { Badge, Button, HStack, Text } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

import { ActionNetworkError } from "@/shared/ui";

import type { FooterNote } from "../model/footer-note";
import { NOTIFY_NOTE } from "../model/notify-note";
import { MobileFooterBar } from "./mobile-footer-bar";

interface MobileGroupDecisionFooterProps {
  label: string;
  note?: FooterNote;
  approveCount: number;
  rejectCount: number;
  danger: boolean;
  canSubmit: boolean;
  submitting: boolean;
  networkError: boolean;
  onSkip: () => void;
  onNoteClick: (note: FooterNote) => void;
  onSubmit: () => void;
}

// 묶음은 확정 버튼 하나다. 승인·반려 개수와 막힌 이유를 버튼 위에 둔다.
export function MobileGroupDecisionFooter({
  label,
  note,
  approveCount,
  rejectCount,
  danger,
  canSubmit,
  submitting,
  networkError,
  onSkip,
  onNoteClick,
  onSubmit,
}: MobileGroupDecisionFooterProps) {
  return (
    <MobileFooterBar>
      {networkError ? <ActionNetworkError /> : null}
      <HStack align="center" gap="075" wrap aria-live="polite">
        <Badge
          colorPalette={approveCount > 0 ? "success" : "gray"}
        >{`승인 ${approveCount}권`}</Badge>
        <Badge colorPalette={rejectCount > 0 ? "danger" : "gray"}>{`반려 ${rejectCount}권`}</Badge>
        {note ? (
          <Button
            variant="ghost"
            size="sm"
            colorPalette="danger"
            onClick={() => onNoteClick(note)}
            className="min-w-0 flex-1 justify-start px-0 text-left font-bold whitespace-normal"
          >
            {note.text}
          </Button>
        ) : (
          <Text typography="body4" foreground="hint" className="flex-1">
            {NOTIFY_NOTE}
          </Text>
        )}
      </HStack>
      <HStack gap="100">
        <Button
          variant="outline"
          colorPalette="gray"
          onClick={onSkip}
          className="min-h-12 w-24 shrink-0"
        >
          건너뛰기
        </Button>
        <Button
          colorPalette={danger ? "danger" : "primary"}
          disabled={!canSubmit}
          loading={submitting}
          onClick={onSubmit}
          className="min-h-12 flex-1"
        >
          {networkError ? <RotateCcw size={16} aria-hidden /> : null}
          {networkError ? "다시 시도" : label}
        </Button>
      </HStack>
    </MobileFooterBar>
  );
}
