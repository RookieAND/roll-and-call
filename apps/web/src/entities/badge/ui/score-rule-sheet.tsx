"use client";

import { cn, HStack, Sheet, Text } from "@roll-and-call/ui";
import { Info, X } from "lucide-react";

import { SCORE_RULES } from "../model/score-rules";

interface ScoreRuleSheetProps {
  className?: string;
}

export function ScoreRuleSheet({ className }: ScoreRuleSheetProps) {
  return (
    <Sheet.Root>
      <Sheet.Trigger
        aria-label="점수 기준 보기"
        className={cn(
          "flex size-11 flex-none items-center justify-center text-hint transition-colors hover:text-muted focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none",
          className,
        )}
      >
        <Info size={18} aria-hidden />
      </Sheet.Trigger>
      <Sheet.Popup className="max-h-[80%] overflow-y-auto">
        <Sheet.Handle />
        <HStack align="center" justify="between" className="-mt-100">
          <Sheet.Title className="text-heading3">점수 기준</Sheet.Title>
          <Sheet.Close
            aria-label="닫기"
            className="-my-125 -mr-150 flex size-11 items-center justify-center text-muted focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
          >
            <X size={20} aria-hidden />
          </Sheet.Close>
        </HStack>
        <Sheet.Body className="mt-150 flex flex-col gap-175">
          {SCORE_RULES.map((rule) => (
            <div key={rule.title} className="flex flex-col gap-025">
              <HStack align="baseline" justify="between" gap="150">
                <Text typography="subtitle2" weight="extrabold">
                  {rule.title}
                </Text>
                <Text typography="subtitle2" weight="extrabold" numeric>
                  {rule.value}
                </Text>
              </HStack>
              <Text typography="body4" foreground="muted" render={<p />} className="break-keep">
                {rule.description}
              </Text>
            </div>
          ))}
          <Text typography="body4" foreground="hint" render={<p />} className="break-keep">
            0점 이하는 순위에 오르지 않습니다.
          </Text>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
