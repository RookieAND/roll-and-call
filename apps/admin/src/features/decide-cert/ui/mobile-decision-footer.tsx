import { Button, HStack, Text } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

import { OTHER_REASON } from "@/shared/lib";
import { ActionNetworkLine, MobileActionBar, MobileMoreSheet } from "@/shared/ui";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { footerNote, type FooterNote } from "../model/footer-note";
import { NOTIFY_NOTE } from "../model/notify-note";
import { FooterLine } from "./footer-line";
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
  const footerLine = networkError ? (
    <ActionNetworkLine />
  ) : (
    <FooterLine note={note} onNoteClick={onNoteClick} />
  );

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
        {networkError ? (
          <ActionNetworkLine />
        ) : (
          <Text
            typography="body4"
            weight={flagged ? "bold" : undefined}
            foreground={flagged ? "danger" : "hint"}
            className="text-center"
          >
            {flagged ? `${picked}, ${flaggedLabels.join("·")} 사진을 지정했습니다` : NOTIFY_NOTE}
          </Text>
        )}
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
          <MobileNextButton href={nextHref} />
        </HStack>
      </MobileActionBar>
    );
  }
  return (
    <MobileActionBar elevated={false}>
      {footerLine}
      <HStack gap="100">
        <MobileMoreSheet title="다른 처리" description="이 신청은 대기열에 그대로 남습니다.">
          <Button variant="outline" colorPalette="gray" onClick={onSkip}>
            건너뛰기
          </Button>
        </MobileMoreSheet>
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
