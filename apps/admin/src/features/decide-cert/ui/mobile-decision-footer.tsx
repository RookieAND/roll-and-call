import { Button, HStack, Text } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

import { OTHER_REASON } from "@/shared/lib";
import { ActionNetworkError, MobileActionBar } from "@/shared/ui";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { footerNote, type FooterNote } from "../model/footer-note";
import { NOTIFY_NOTE } from "../model/notify-note";
import { MobileNextButton } from "./mobile-next-button";

interface MobileDecisionFooterProps {
  state: CertReviewState;
  rejecting: boolean;
  reviewable: boolean;
  checkedCount: number;
  checkableCount: number;
  canApprove: boolean;
  canReject: boolean;
  approving: boolean;
  rejectingPending: boolean;
  approvalNetworkError: boolean;
  rejectionNetworkError: boolean;
  reason: string;
  flaggedLabels: string[];
  canStartReject: boolean;
  nextHref?: string;
  onSkip: () => void;
  onNoteClick: (note: FooterNote) => void;
  onStartReject: () => void;
  onCancelReject: () => void;
  onApprove: () => void;
  onReject: () => void;
}

// [반려]를 누르면 아래 바가 [취소] [반려 확정]으로 바뀐다. 막힌 이유와 알림 안내는 버튼 위 한 줄이다.
export function MobileDecisionFooter({
  state,
  rejecting,
  reviewable,
  checkedCount,
  checkableCount,
  canApprove,
  canReject,
  approving,
  rejectingPending,
  approvalNetworkError,
  rejectionNetworkError,
  reason,
  flaggedLabels,
  canStartReject,
  nextHref,
  onSkip,
  onNoteClick,
  onStartReject,
  onCancelReject,
  onApprove,
  onReject,
}: MobileDecisionFooterProps) {
  const networkError = approvalNetworkError || rejectionNetworkError;
  const note = footerNote({ reviewable, checkedCount, checkableCount });

  if (state === CERT_REVIEW_STATE.withdrawn) {
    return (
      <MobileActionBar elevated={false}>
        <MobileNextButton href={nextHref} />
      </MobileActionBar>
    );
  }
  if (rejecting) {
    const flagged = Boolean(reason && flaggedLabels.length);
    const picked = reason === OTHER_REASON ? "기타 사유를 입력했고" : "사유 1개를 골랐고";
    return (
      <MobileActionBar elevated={false}>
        {networkError ? <ActionNetworkError /> : null}
        <Text
          typography="body4"
          weight={flagged ? "bold" : undefined}
          foreground={flagged ? "danger" : "hint"}
          className="text-center"
        >
          {flagged ? `${picked}, ${flaggedLabels.join("·")} 사진을 지정했습니다` : NOTIFY_NOTE}
        </Text>
        <HStack gap="100">
          <Button
            variant="ghost"
            colorPalette="gray"
            onClick={onCancelReject}
            className="min-h-12 flex-1"
          >
            취소
          </Button>
          <Button
            colorPalette="danger"
            disabled={!canReject}
            loading={rejectingPending}
            onClick={onReject}
            className="min-h-12 flex-1"
          >
            {rejectionNetworkError ? <RotateCcw size={16} aria-hidden /> : null}
            {rejectionNetworkError ? "다시 시도" : "반려 확정"}
          </Button>
        </HStack>
      </MobileActionBar>
    );
  }
  if (state === CERT_REVIEW_STATE.processed) {
    return (
      <MobileActionBar elevated={false}>
        <Text typography="body4" foreground="hint" className="text-center">
          {NOTIFY_NOTE}
        </Text>
        <HStack gap="100">
          <Button
            variant="outline"
            colorPalette="gray"
            onClick={onSkip}
            className="min-h-12 w-24 shrink-0"
          >
            건너뛰기
          </Button>
          <MobileNextButton href={nextHref} />
        </HStack>
      </MobileActionBar>
    );
  }
  return (
    <MobileActionBar elevated={false}>
      {networkError ? <ActionNetworkError /> : null}
      <HStack align="center" gap="100">
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
        <Button variant="ghost" colorPalette="gray" onClick={onSkip} className="min-h-10 shrink-0">
          건너뛰기
        </Button>
      </HStack>
      <HStack gap="100">
        <Button
          variant="outline"
          colorPalette="danger"
          disabled={!canStartReject}
          onClick={onStartReject}
          className="min-h-12 flex-1"
        >
          반려
        </Button>
        <Button
          colorPalette="success"
          disabled={!canApprove}
          loading={approving}
          onClick={onApprove}
          className="min-h-12 flex-[1.4]"
        >
          {approvalNetworkError ? <RotateCcw size={16} aria-hidden /> : null}
          {approvalNetworkError ? "다시 시도" : "승인"}
        </Button>
      </HStack>
    </MobileActionBar>
  );
}
