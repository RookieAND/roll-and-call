"use client";

import { REVIEW_REASON, REVIEW_REASONS, type ReviewReason } from "@/shared/lib";
import { ReasonChips } from "@/shared/ui";

import { OTHER_TEXT_MAX_LENGTH } from "../model/review-reason-text";

const REASON_LABELS = REVIEW_REASONS.map((key) => REVIEW_REASON[key]);

interface ReviewReasonFieldProps {
  reasonKey: ReviewReason | null;
  otherText: string;
  disabled: boolean;
  onReasonKeyChange: (reasonKey: ReviewReason | null) => void;
  onOtherTextChange: (text: string) => void;
}

// 숨김·제거가 함께 쓰는 사유 칩 6개. 기본값이 없고 「기타」는 입력이 필수다.
export function ReviewReasonField({
  reasonKey,
  otherText,
  disabled,
  onReasonKeyChange,
  onOtherTextChange,
}: ReviewReasonFieldProps) {
  const keyOf = (label: string) => REVIEW_REASONS.find((key) => REVIEW_REASON[key] === label);
  return (
    <ReasonChips
      label="사유"
      reasons={REASON_LABELS}
      value={reasonKey ? REVIEW_REASON[reasonKey] : null}
      otherText={otherText}
      onValueChange={(label) => onReasonKeyChange(keyOf(label) ?? null)}
      onOtherTextChange={onOtherTextChange}
      otherPlaceholder="작성자에게 보일 사유를 적어 주세요"
      otherMaxLength={OTHER_TEXT_MAX_LENGTH}
      help={reasonKey ? undefined : "사유를 고르면 확정할 수 있습니다"}
      disabled={disabled}
      regularWeight
    />
  );
}
