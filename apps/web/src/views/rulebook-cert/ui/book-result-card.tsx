import { Badge, Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { CircleAlert, ImageOff, MessageSquare } from "lucide-react";
import Link from "next/link";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";

import type { BookResult } from "../model/to-book-result";

const thumbFrame = cva("aspect-[3/4] overflow-hidden rounded-400 bg-secondary-strong", {
  variants: { flagged: { true: "border-2 border-danger-600", false: "border border-gray-200" } },
});

interface BookResultCardProps {
  result: BookResult;
}

export function BookResultCard({ result }: BookResultCardProps) {
  const reasonClass = result.reason?.tone === "danger" ? "text-danger-600" : "text-warning-600";
  return (
    <Card.Root padding="none">
      <VStack gap="150" className="p-175">
        <HStack align="start" gap="125">
          <VStack gap="025" className="min-w-0 flex-1">
            <HStack align="center" gap="075" wrap>
              <Text typography="subtitle1">{result.title}</Text>
              <Badge>{RULEBOOK_KIND_LABEL[result.kind]}</Badge>
            </HStack>
            <Text typography="body4" foreground="hint">
              {result.meta}
            </Text>
          </VStack>
          <Badge colorPalette={result.badge.palette} className="flex-none">
            {result.badge.label}
          </Badge>
        </HStack>

        {result.reason && (
          <VStack gap="025">
            <Text typography="body4" weight="bold" foreground="muted">
              {result.reason.label}
            </Text>
            <HStack align="start" gap="075">
              <CircleAlert
                size={16}
                strokeWidth={2.1}
                aria-hidden
                className={`mt-025 flex-none ${reasonClass}`}
              />
              <Text typography="body2" weight="bold" foreground="normal" className="break-keep">
                {result.reason.text}
              </Text>
            </HStack>
          </VStack>
        )}

        {result.thumbs.length > 0 && (
          <div className="flex gap-100">
            {result.thumbs.map((thumb) => (
              <VStack key={thumb.label} gap="050" className="min-w-0 flex-1">
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
          </div>
        )}

        {result.deleted && (
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
              보관 기간이 지나 사진이 삭제됐습니다.
              <br />
              새로 찍어 올려 주세요.
            </Text>
          </HStack>
        )}

        {result.memo && (
          <VStack gap="025" className="rounded-400 bg-gray-50 px-150 py-125">
            <HStack align="center" gap="050">
              <MessageSquare size={14} strokeWidth={2.1} aria-hidden className="text-gray-600" />
              <Text typography="body4" weight="bold" foreground="muted">
                운영진 메모
              </Text>
            </HStack>
            <Text typography="body3" className="break-keep whitespace-pre-line">
              {result.memo}
            </Text>
          </VStack>
        )}

        {result.retryHref && (
          <Button render={<Link href={result.retryHref} />} className="w-full">
            다시 신청
          </Button>
        )}
      </VStack>
    </Card.Root>
  );
}
