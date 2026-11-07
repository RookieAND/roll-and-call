"use client";

import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";
import { Button, Callout, Chip, HStack, Text, Textarea, VStack } from "@roll-and-call/ui";
import { useId } from "react";

import { ActionNetworkError } from "@/shared/ui";

import { HOMEBREW_REJECT_REASONS } from "../model/homebrew-reject-reasons";
import { rejectPlaceholder } from "../model/reject-placeholder";
import type { useHomebrewDecision } from "./use-homebrew-decision";

interface HomebrewRejectPanelProps {
  decision: ReturnType<typeof useHomebrewDecision>;
  // 알림에 들어가는 룰 이름(판본 포함)
  ruleLabel: string;
}

// 반려 카드 자리에 열리고 확인 단계를 겸한다. [취소]는 입력한 문구를 버린다.
export function HomebrewRejectPanel({ decision, ruleLabel }: HomebrewRejectPanelProps) {
  const messageId = useId();
  const { reason, message, form, rejectingPending: pending } = decision;
  return (
    <VStack
      gap="175"
      render={<section aria-label="반려 사유" />}
      className="rounded-600 border border-gray-200 bg-surface p-175"
    >
      <Text typography="heading3" render={<h2 />}>
        반려 사유
      </Text>
      <HStack role="radiogroup" aria-label="반려 사유" gap="075" wrap>
        {HOMEBREW_REJECT_REASONS.map((candidate) => (
          <Chip
            key={candidate.name}
            tone="outline"
            role="radio"
            aria-checked={reason === candidate.name}
            selected={reason === candidate.name}
            disabled={pending}
            onClick={() => decision.chooseReason(candidate.name)}
          >
            {candidate.name}
          </Chip>
        ))}
      </HStack>
      <VStack gap="075" className="px-025">
        <HStack align="center" gap="100">
          <Text
            typography="body4"
            weight="bold"
            foreground="muted"
            render={<label htmlFor={messageId} />}
          >
            신청자에게 보일 문구
            {form.other ? (
              <Text typography="body4" foreground="danger" render={<span />} className="ml-025">
                *
              </Text>
            ) : null}
          </Text>
          <Text
            typography="body4"
            numeric
            weight={form.full ? "bold" : undefined}
            foreground={form.full ? "danger" : "hint"}
            className="ml-auto"
          >
            {`${form.length} / ${HOMEBREW_LIMIT.rejectReasonLength}`}
          </Text>
        </HStack>
        <Textarea
          id={messageId}
          rows={5}
          value={message}
          maxLength={HOMEBREW_LIMIT.rejectReasonLength}
          placeholder={rejectPlaceholder({ reason, other: form.other })}
          disabled={!reason || pending}
          onChange={(event) => decision.setMessage(event.target.value)}
        />
        {form.full ? (
          <Text typography="body4" foreground="danger">
            200자까지 쓸 수 있습니다.
          </Text>
        ) : null}
        {!form.full && form.otherBlank ? (
          <Text typography="body4" foreground="hint">
            「기타」를 고르면 문구를 꼭 적어야 합니다.
          </Text>
        ) : null}
      </VStack>
      <Callout.Root colorPalette="gray">
        <Callout.Title>제작자의 알림 탭에 이렇게 보입니다</Callout.Title>
        <Callout.Description>
          {`${ruleLabel} 내가 만든 룰 신청이 반려되었습니다.`}
          <Text typography="body4" foreground="hint" className="mt-050 block">
            사유는 알림을 눌러 신청 상세에서 확인합니다.
          </Text>
        </Callout.Description>
      </Callout.Root>
      {decision.rejectFailed ? <ActionNetworkError /> : null}
      {form.blockedReason ? (
        <Text typography="body4" foreground="muted" className="text-right">
          {form.blockedReason}
        </Text>
      ) : null}
      <HStack gap="100">
        <Button
          variant="outline"
          colorPalette="gray"
          className="flex-1"
          disabled={pending}
          onClick={decision.cancelReject}
        >
          취소
        </Button>
        <Button
          colorPalette="danger"
          className="flex-1"
          disabled={!form.canSubmit && !pending}
          loading={pending}
          onClick={() => void decision.reject()}
        >
          반려하기
        </Button>
      </HStack>
    </VStack>
  );
}
