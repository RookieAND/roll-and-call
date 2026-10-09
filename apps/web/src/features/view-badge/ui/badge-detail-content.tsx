import { HStack, Progress, Sheet, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { ATTENDANCE_HINT, BadgeMedal, TONE_CLASS } from "@/entities/badge";
import { LineBreaks, ServerLink } from "@/shared/ui";

import type { BadgeDetail } from "../model/badge-detail";
import { BadgeDetailSteps } from "./badge-detail-steps";

interface BadgeDetailContentProps {
  detail: BadgeDetail;
}

export function BadgeDetailContent({ detail }: BadgeDetailContentProps) {
  const { earned, progress } = detail;
  return (
    <VStack gap="200">
      <VStack align="center" gap="125" className="pt-300 text-center">
        <BadgeMedal
          emoji={detail.medal.emoji}
          look={detail.medal.look}
          locked={detail.medal.locked}
          ribbon={detail.medal.ribbon}
          size="xl"
          className="mb-075"
        />
        <Text
          typography="body4"
          weight="bold"
          foreground="inherit"
          className={TONE_CLASS[detail.tierTone]}
        >
          {detail.tierLabel}
        </Text>
        <VStack align="center" gap="050">
          <Sheet.Title render={<Text typography="heading2" render={<h2 />} />}>
            {detail.name}
          </Sheet.Title>
          <Text typography="body2" foreground="muted" className="[text-wrap:pretty]">
            <LineBreaks lines={detail.condition.split("\n")} />
          </Text>
        </VStack>
      </VStack>

      {earned && (
        <VStack className="rounded-500 border border-gray-200">
          <HStack align="center" gap="125" className="min-h-11 px-175">
            <Text typography="body3" foreground="muted" className="flex-1">
              받은 날
            </Text>
            <Text typography="body3" weight="bold" numeric>
              {earned.dateLabel}
            </Text>
          </HStack>
          {earned.source && (
            <HStack align="center" gap="125" className="min-h-11 border-t border-gray-200 px-175">
              <Text typography="body3" foreground="muted" className="flex-none">
                {earned.source.heading}
              </Text>
              {earned.source.href ? (
                <Text
                  typography="body3"
                  weight="bold"
                  foreground="primary"
                  render={<ServerLink path={earned.source.href} />}
                  className="ml-auto inline-flex min-w-0 items-center gap-025 hover:underline"
                >
                  <span className="min-w-0 truncate">{earned.source.label}</span>
                  <ChevronRight size={13} aria-hidden className="flex-none" />
                </Text>
              ) : (
                <Text typography="body3" weight="bold" truncate className="ml-auto min-w-0">
                  {earned.source.label}
                </Text>
              )}
            </HStack>
          )}
        </VStack>
      )}

      {progress && (
        <VStack gap="075" className="rounded-500 border border-gray-200 px-175 py-150">
          <HStack align="baseline">
            <Text typography="body3" weight="extrabold" className="flex-1">
              {progress.label}
            </Text>
            <Text typography="body4" foreground="hint" numeric>
              {progress.countLabel}
            </Text>
          </HStack>
          <Progress value={progress.value} max={progress.max} />
          <Text typography="body4" foreground="hint">
            {ATTENDANCE_HINT}
          </Text>
        </VStack>
      )}

      {detail.steps.length > 0 && (
        <BadgeDetailSteps title={detail.stepsTitle} steps={detail.steps} />
      )}
    </VStack>
  );
}
