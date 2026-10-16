import { Button, HStack } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

import { ActionNetworkLine, MobileActionBar, MobileMoreSheet } from "@/shared/ui";

import type { FooterNote } from "../model/footer-note";
import { FooterLine } from "./footer-line";

interface MobileGroupDecisionFooterProps {
  label: string;
  note?: FooterNote;
  danger: boolean;
  canSubmit: boolean;
  submitting: boolean;
  networkError: boolean;
  onSkip: () => void;
  onNoteClick: (note: FooterNote) => void;
  onSubmit: () => void;
}

// 묶음은 확정 버튼 하나다. 막힌 이유를 버튼 위 한 줄에 둔다. 승인·반려 개수는 확정 버튼 글자가 말한다.
export function MobileGroupDecisionFooter({
  label,
  note,
  danger,
  canSubmit,
  submitting,
  networkError,
  onSkip,
  onNoteClick,
  onSubmit,
}: MobileGroupDecisionFooterProps) {
  return (
    <MobileActionBar elevated={false}>
      {networkError ? <ActionNetworkLine /> : <FooterLine note={note} onNoteClick={onNoteClick} />}
      <HStack gap="100">
        <MobileMoreSheet title="다른 처리" description="이 신청은 대기열에 그대로 남습니다.">
          <Button variant="outline" colorPalette="gray" onClick={onSkip}>
            건너뛰기
          </Button>
        </MobileMoreSheet>
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
    </MobileActionBar>
  );
}
