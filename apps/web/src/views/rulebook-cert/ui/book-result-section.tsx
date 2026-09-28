import { Badge, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { CircleAlert, ImageOff } from "lucide-react";
import { Fragment } from "react";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";

import type { BookResult } from "../model/to-book-result";
import { ResultSection } from "./result-section";

const thumbFrame = cva("aspect-[3/4] overflow-hidden rounded-400 bg-secondary-strong", {
  variants: { flagged: { true: "border-2 border-danger-600", false: "border border-gray-200" } },
});

interface BookResultSectionProps {
  result: BookResult;
  // 세트 안내처럼 책 머리 아래에 붙이는 문구.
  guide?: string | null;
}

export function BookResultSection({ result, guide }: BookResultSectionProps) {
  return (
    <VStack>
      <VStack gap="100" className="px-200 py-250">
        <HStack align="start" gap="125">
          <Text typography="heading2" className="min-w-0 flex-1 break-keep" render={<h2 />}>
            {result.title}
          </Text>
          <HStack align="center" gap="075" className="flex-none pt-025">
            <Badge colorPalette="gray">{RULEBOOK_KIND_LABEL[result.kind]}</Badge>
            {result.badge && (
              <Badge colorPalette={result.badge.palette}>{result.badge.label}</Badge>
            )}
          </HStack>
        </HStack>
        <Text typography="body3" foreground="muted">
          {result.mode}
        </Text>
        <Grid className="grid-cols-[auto_1fr] gap-x-150 gap-y-025">
          {result.dates.map((date) => (
            <Fragment key={date.label}>
              <Text typography="body3" foreground="hint">
                {date.label}
              </Text>
              <Text typography="body3" foreground="muted" numeric>
                {date.value}
              </Text>
            </Fragment>
          ))}
        </Grid>
        {result.statusNote && (
          <Text typography="body3" foreground="muted">
            {result.statusNote}
          </Text>
        )}
        {guide && (
          <Text typography="body3" foreground="muted" render={<p />} className="mt-050 break-keep">
            {guide}
          </Text>
        )}
      </VStack>

      {result.reason && (
        <ResultSection label={result.reason.label}>
          <HStack align="start" gap="075">
            <CircleAlert
              size={16}
              strokeWidth={2.1}
              aria-hidden
              className="mt-025 flex-none text-danger-600"
            />
            <Text typography="body2" weight="bold" className="break-keep">
              {result.reason.text}
            </Text>
          </HStack>
        </ResultSection>
      )}

      {result.thumbs.length > 0 && (
        <ResultSection label="올린 사진">
          <HStack gap="100">
            {result.thumbs.map((thumb) => (
              <VStack key={thumb.label} gap="075" className="min-w-0 flex-1">
                <div className={thumbFrame({ flagged: thumb.flagged })}>
                  {thumb.url && (
                    // oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다.
                    <img
                      src={thumb.url}
                      alt={`${thumb.label} 사진`}
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <Text
                  typography="body4"
                  weight="bold"
                  foreground={thumb.flagged ? "danger" : "muted"}
                  className="text-center"
                >
                  {thumb.flagged ? `${thumb.label} · 문제` : thumb.label}
                </Text>
              </VStack>
            ))}
          </HStack>
        </ResultSection>
      )}

      {result.deleted && (
        <ResultSection label="올린 사진">
          <HStack
            align="start"
            gap="125"
            className="rounded-500 border border-dashed border-gray-300 p-175"
          >
            <ImageOff
              size={18}
              strokeWidth={2.1}
              aria-hidden
              className="mt-025 flex-none text-hint"
            />
            <Text typography="body3" foreground="muted" render={<p />}>
              보관 기간이 지나 사진이 삭제됐어요.
              <br />
              새로 찍어 올려 주세요.
            </Text>
          </HStack>
        </ResultSection>
      )}

      {result.memo && (
        <ResultSection label="운영진 메모">
          <Text typography="body2" className="break-keep whitespace-pre-line">
            {result.memo}
          </Text>
        </ResultSection>
      )}
    </VStack>
  );
}
