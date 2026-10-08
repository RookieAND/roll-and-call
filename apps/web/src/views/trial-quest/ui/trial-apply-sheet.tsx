"use client";

import { Button, Card, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

import { TRIAL_GAME_TITLE } from "../model/trial-copy";
import { TRIAL_KIND, type TrialKind } from "../model/trial-kind";

interface TrialApplySheetProps {
  kind: TrialKind | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const BODY_LINES = {
  [TRIAL_KIND.firstCome]: [
    "선착순 구인은 신청하면 바로 확정됩니다.",
    "체험이라 실제 신청은 만들어지지 않습니다.",
  ],
  [TRIAL_KIND.lottery]: [
    "추첨 구인은 마감 뒤 추첨으로 확정됩니다.",
    "체험이라 실제 신청은 만들어지지 않습니다.",
  ],
} as const satisfies Record<TrialKind, readonly string[]>;

const SUMMARY_META = {
  [TRIAL_KIND.firstCome]: "CoC 7th · 선착순 4명",
  [TRIAL_KIND.lottery]: "CoC 7th · 추첨 4명",
} as const satisfies Record<TrialKind, string>;

export function TrialApplySheet({ kind, onConfirm, onCancel }: TrialApplySheetProps) {
  return (
    <Sheet.Root open={kind !== null} onOpenChange={(open) => !open && onCancel()}>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className="mb-075 text-heading3">이 구인에 신청할까요?</Sheet.Title>
        {kind && (
          <Sheet.Body>
            <VStack gap="150">
              <Text typography="body3" foreground="muted" render={<p />}>
                <LineBreaks lines={BODY_LINES[kind]} />
              </Text>
              <Card.Root padding="md">
                <VStack gap="025">
                  <Text typography="body2" weight="bold">
                    {TRIAL_GAME_TITLE[kind]}
                  </Text>
                  <Text typography="body4" foreground="hint">
                    {SUMMARY_META[kind]}
                  </Text>
                </VStack>
              </Card.Root>
              <HStack gap="100">
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="lg"
                  className="flex-1"
                  onClick={onCancel}
                >
                  취소
                </Button>
                <Button size="lg" className="flex-1" onClick={onConfirm}>
                  신청하기
                </Button>
              </HStack>
            </VStack>
          </Sheet.Body>
        )}
      </Sheet.Popup>
    </Sheet.Root>
  );
}
