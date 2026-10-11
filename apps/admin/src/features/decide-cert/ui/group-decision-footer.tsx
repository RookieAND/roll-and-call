import { Button } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";
import type { RefObject } from "react";

import { ActionNetworkError, KeyHint } from "@/shared/ui";

import type { FooterNote } from "../model/footer-note";
import { DecisionFooter } from "./decision-footer";
import { SkipStatus } from "./skip-status";

interface GroupDecisionFooterProps {
  label: string;
  note?: FooterNote;
  danger: boolean;
  canSubmit: boolean;
  submitting: boolean;
  networkError: boolean;
  showEnterHint: boolean;
  approveRef: RefObject<HTMLButtonElement | null>;
  onSkip: () => void;
  onNoteClick: (note: FooterNote) => void;
  onSubmit: () => void;
}

// 묶음은 승인과 반려를 한 번에 확정한다. 취소·반려 버튼 없이 책마다 고른 결과가 이 버튼 하나로 처리된다.
export function GroupDecisionFooter({
  label,
  note,
  danger,
  canSubmit,
  submitting,
  networkError,
  showEnterHint,
  approveRef,
  onSkip,
  onNoteClick,
  onSubmit,
}: GroupDecisionFooterProps) {
  const palette = danger ? "danger" : "primary";
  return (
    <DecisionFooter
      notice={networkError ? <ActionNetworkError /> : null}
      status={<SkipStatus note={note} onSkip={onSkip} onNoteClick={onNoteClick} />}
    >
      <Button
        ref={approveRef}
        colorPalette={palette}
        disabled={!canSubmit}
        loading={submitting}
        onClick={onSubmit}
      >
        {networkError ? <RotateCcw size={16} aria-hidden /> : null}
        {networkError ? "다시 시도" : label}
        {networkError || !showEnterHint ? null : <KeyHint keyLabel="⏎" />}
      </Button>
    </DecisionFooter>
  );
}
