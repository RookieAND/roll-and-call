"use client";

import {
  Button,
  Field,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  Sheet,
  Text,
  Textarea,
  VStack,
} from "@roll-and-call/ui";
import { X } from "lucide-react";
import { useState } from "react";

import {
  REPORT_DETAIL_MAX_LENGTH,
  REPORT_REASON,
  REPORT_REASON_LABEL,
  type ReportReason,
} from "@/entities/review";
import { toast, useAction } from "@/shared/ui";

import { reportReview } from "../api/report-review";

const REASONS = Object.values(REPORT_REASON);

interface ReportReviewSheetProps {
  reviewId: string;
  // "오세진님의 후기 · 물벼락"
  subject: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportReviewSheet({
  reviewId,
  subject,
  open,
  onOpenChange,
}: ReportReviewSheetProps) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState("");
  const { pending, run } = useAction();
  const other = reason === REPORT_REASON.other;

  function submit() {
    if (!reason) return;
    run(() => reportReview({ reviewId, reason, detail }), {
      onSuccess: () => {
        toast.success("신고를 접수했습니다");
        onOpenChange(false);
        setReason(null);
        setDetail("");
      },
    });
  }

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="후기 신고" className="max-h-[94dvh]">
        <Sheet.Handle />
        <Sheet.Body>
          <VStack gap="175" className="pb-250">
            <HStack align="start" gap="100">
              <VStack gap="025" className="min-w-0 flex-1 pt-050">
                <Text typography="heading3" render={<h2 />}>
                  후기 신고
                </Text>
                <Text typography="body4" foreground="hint" truncate>
                  {subject}
                </Text>
              </VStack>
              <Sheet.Close render={<IconButton variant="ghost" aria-label="닫기" />}>
                <X size={20} />
              </Sheet.Close>
            </HStack>

            <VStack gap="100">
              <Text typography="subtitle2" foreground="muted" id="report-reason-label">
                어떤 문제가 있나요?
              </Text>
              <RadioGroup
                value={reason}
                onValueChange={(value) => setReason(value as ReportReason)}
                aria-labelledby="report-reason-label"
                render={<VStack />}
                className="overflow-hidden rounded-500 border border-gray-200 [&>*+*]:border-t [&>*+*]:border-gray-200"
              >
                {REASONS.map((value) => (
                  <Radio.Field key={value} className="min-h-13 w-full px-175">
                    <Radio.Root value={value}>
                      <Radio.Indicator />
                    </Radio.Root>
                    <Radio.Label>{REPORT_REASON_LABEL[value]}</Radio.Label>
                  </Radio.Field>
                ))}
              </RadioGroup>
              {other && (
                <Field.Root
                  htmlFor="report-detail"
                  counter={`${detail.length} / ${REPORT_DETAIL_MAX_LENGTH}`}
                >
                  <Textarea
                    id="report-detail"
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder="문제가 되는 점을 적어 주세요"
                    maxLength={REPORT_DETAIL_MAX_LENGTH}
                    rows={3}
                  />
                </Field.Root>
              )}
            </VStack>

            <Text typography="body4" foreground="hint" render={<p />}>
              확인 전까지 후기는 그대로 보입니다.
            </Text>
            <Button
              size="lg"
              className="w-full"
              disabled={!reason}
              loading={pending}
              onClick={submit}
            >
              신고하기
            </Button>
          </VStack>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
