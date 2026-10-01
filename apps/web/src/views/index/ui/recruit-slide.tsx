import { Avatar, Badge, Button, HStack, Progress, Text, VStack } from "@roll-and-call/ui";
import { ArrowLeftRight, Clock3, Users } from "lucide-react";

import { PreviewCard } from "./preview-card";

export function RecruitSlide() {
  return (
    <>
      <PreviewCard icon={Users} title="구인" aside="마감 D-3" wide>
        <HStack
          align="end"
          className="h-24 rounded-500 p-125"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--rc-color-bg-primary-weak), var(--rc-color-bg-canvas-raised))",
          }}
        >
          <Badge colorPalette="primary">모집 중</Badge>
        </HStack>
        <VStack gap="025">
          <Text typography="heading2">달빛 여관의 실종자</Text>
          <Text typography="body3" foreground="hint">
            GM 라온 · CoC 7판 · 4시간
          </Text>
        </VStack>
        <HStack align="center" gap="125">
          <Progress value={3} max={4} className="flex-1" />
          <Text typography="body4" weight="bold" numeric>
            확정 3 / 4
          </Text>
        </HStack>
        <Button size="md" tabIndex={-1} className="w-full">
          신청하기
        </Button>
      </PreviewCard>
      <PreviewCard icon={ArrowLeftRight} title="모집 방식">
        <div className="grid grid-cols-2 gap-050 rounded-400 bg-gray-100 p-025">
          <Text
            typography="body4"
            weight="extrabold"
            className="flex h-7 items-center justify-center rounded-300 bg-surface shadow-sm"
          >
            선착순
          </Text>
          <Text
            typography="body4"
            weight="bold"
            foreground="hint"
            className="flex h-7 items-center justify-center"
          >
            추첨
          </Text>
        </div>
        <Text typography="body4" foreground="muted">
          먼저 신청한 4명이 바로 확정됩니다.
        </Text>
      </PreviewCard>
      <PreviewCard icon={Clock3} title="대기">
        <VStack gap="050">
          <HStack align="center" gap="100" className="h-[30px] px-100">
            <Text typography="body4" weight="extrabold" foreground="hint" numeric className="w-3.5">
              1
            </Text>
            <Avatar size="sm" name="오세진" />
            <Text typography="body4" weight="bold" foreground="muted" truncate>
              오세진
            </Text>
          </HStack>
          <HStack align="center" gap="100" className="h-[30px] rounded-300 bg-primary-50 px-100">
            <Text
              typography="body4"
              weight="extrabold"
              foreground="primary"
              numeric
              className="w-3.5"
            >
              2
            </Text>
            <span className="flex size-6 flex-none items-center justify-center rounded-full bg-primary-600">
              <Text typography="body5" weight="extrabold" foreground="onPrimary">
                나
              </Text>
            </span>
            <Text typography="body4" weight="extrabold" foreground="primary" truncate>
              내 순서
            </Text>
          </HStack>
        </VStack>
      </PreviewCard>
    </>
  );
}
