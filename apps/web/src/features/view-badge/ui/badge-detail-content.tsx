import { HStack, Progress, Sheet, Text, VStack, cn, Button } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { BadgeMedal, TONE_CLASS } from "@/entities/badge";

import type { BadgeDetail } from "../model/badge-detail";
import { BadgeDetailSteps } from "./badge-detail-steps";

interface BadgeDetailContentProps {
  detail: BadgeDetail;
}

export function BadgeDetailContent({ detail }: BadgeDetailContentProps) {
  const { earned, progress } = detail;
  return (
    <VStack gap="200">
      <VStack align="center" gap="125" className="pt-100 text-center">
        <BadgeMedal
          emoji={detail.medal.emoji}
          grade={detail.medal.grade}
          locked={detail.medal.locked}
          ribbon={detail.medal.ribbon}
          size="xl"
          className="mb-075"
        />
        <Text
          typography="body4"
          weight="bold"
          foreground="inherit"
          className={cn("tracking-widest", TONE_CLASS[detail.tierTone])}
        >
          {detail.tierLabel}
        </Text>
        <Sheet.Title render={<Text typography="heading2" render={<h2 />} />}>
          {detail.name}
        </Sheet.Title>
        <Text typography="body2" foreground="muted" className="[text-wrap:pretty]">
          {detail.condition}
        </Text>
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
              <Text typography="body3" foreground="muted" className="flex-1">
                {earned.source.heading}
              </Text>
              {earned.source.href ? (
                <Button
                  render={<Link href={earned.source.href} />}
                  variant="ghost"
                  colorPalette="primary"
                  size="sm"
                  className="-mr-100"
                >
                  {earned.source.label}
                  <ChevronRight size={13} aria-hidden />
                </Button>
              ) : (
                <Text typography="body3" weight="bold">
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
        </VStack>
      )}

      {detail.steps.length > 0 && (
        <BadgeDetailSteps title={detail.stepsTitle} steps={detail.steps} />
      )}
    </VStack>
  );
}
