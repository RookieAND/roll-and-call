"use client";

import { Badge, Collapsible, HStack, Text } from "@roll-and-call/ui";
import { ChevronDown, CircleCheck } from "lucide-react";

import type { CertReview } from "@/shared/server";
import { FactRows, IconBadge } from "@/shared/ui";

interface QuizPanelProps {
  quiz: CertReview["quiz"];
  // 지금 사용 중인 문항이 있는데 퀴즈가 없으면 문항을 등록하기 전에 낸 신청이다.
  hasActiveQuiz: boolean;
}

// 본문 퀴즈 결과. 퀴즈를 맞혀야 제출할 수 있으므로 퀴즈가 있으면 늘 통과다. 펼치면 문항과 답을 본다.
export function QuizPanel({ quiz, hasActiveQuiz }: QuizPanelProps) {
  if (!quiz) {
    return (
      <HStack
        render={<section aria-label="본문 퀴즈" />}
        align="center"
        gap="100"
        className="rounded-600 border border-gray-200 bg-surface px-175 py-125"
      >
        <Text typography="subtitle1">본문 퀴즈</Text>
        <Badge>{hasActiveQuiz ? "퀴즈 없이 신청" : "등록된 퀴즈 없음"}</Badge>
        <Text typography="body4" foreground="hint" className="ml-auto">
          {hasActiveQuiz
            ? "문항을 등록하기 전에 낸 신청이어서 퀴즈 단계가 없었습니다"
            : "퀴즈가 없는 책이어서 퀴즈 단계를 건너뛰었습니다"}
        </Text>
      </HStack>
    );
  }
  return (
    <Collapsible.Root
      render={<section aria-label="본문 퀴즈" />}
      className="overflow-hidden rounded-600 border border-gray-200 bg-surface"
    >
      <Collapsible.Trigger className="group flex w-full items-center gap-100 px-175 py-125 text-left">
        <Text typography="subtitle1">본문 퀴즈</Text>
        <IconBadge icon={CircleCheck} colorPalette="success">
          퀴즈 통과
        </IconBadge>
        <Text
          typography="body4"
          weight="bold"
          foreground="muted"
          className="ml-auto inline-flex items-center gap-050"
        >
          <span className="group-data-panel-open:hidden">펼치기</span>
          <span className="hidden group-data-panel-open:inline">접기</span>
          <ChevronDown
            size={14}
            aria-hidden
            className="transition-transform group-data-panel-open:rotate-180"
          />
        </Text>
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <div className="border-t border-(--rc-color-border-subtle) px-175 py-050">
          <FactRows
            items={[
              { label: "출제된 문항", value: quiz.question },
              { label: "신청자의 답", value: quiz.answer },
              { label: "참고 쪽수", value: quiz.page || "없음" },
            ]}
          />
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
