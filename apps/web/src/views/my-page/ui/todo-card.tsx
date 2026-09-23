import { Button, Card, HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { CircleAlert, Clock } from "lucide-react";
import Link from "next/link";

import { LineBreaks } from "@/shared/ui";
import { SESSION_ACTION_KIND } from "@/widgets/session-list";

import type { TodoItem } from "../model/session-todos";

const EYEBROW: Record<string, string> = {
  [SESSION_ACTION_KIND.drawLottery]: "추첨 대기",
  [SESSION_ACTION_KIND.confirmTime]: "세션 일시 미정",
  [SESSION_ACTION_KIND.reviewApplicants]: "신청 승인 대기",
  [SESSION_ACTION_KIND.fillVacancy]: "빈자리 생김",
  [SESSION_ACTION_KIND.confirmAttendance]: "출석 미확인",
  [SESSION_ACTION_KIND.submitAvailability]: "가능 시간 미제출",
};

// 지금 막혀 있는 일은 카드 전체를 붉게 칠하고 초록 버튼을, 여유가 있는 일은 기본 카드에 보라 버튼을 단다.
const todoCard = cva("p-175", {
  variants: { blocked: { true: "border-danger-200 bg-danger-50", false: "" } },
});

interface TodoCardProps {
  item: TodoItem;
}

export function TodoCard({ item: { title, todo } }: TodoCardProps) {
  const label = EYEBROW[todo.kind]!;
  const Icon = todo.blocked ? CircleAlert : Clock;

  const buttonVariant = todo.blocked ? "solid" : "tinted";
  const buttonPalette = todo.blocked ? "success" : "primary";

  return (
    <Card.Root padding="none" className={todoCard({ blocked: todo.blocked })}>
      <HStack
        align="center"
        gap="100"
        className={todo.blocked ? "text-danger-600" : "text-warning-600"}
      >
        <Icon size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
        <Text weight="bold" typography="body4" foreground="inherit">
          {label}
        </Text>
      </HStack>
      <Text truncate typography="heading3" render={<h3 />} className="mt-100">
        {title}
      </Text>
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="mt-050 [text-wrap:pretty]"
      >
        <LineBreaks lines={todo.lines} />
      </Text>
      <Button
        render={<Link href={todo.href} />}
        variant={buttonVariant}
        colorPalette={buttonPalette}
        className="mt-150 w-full"
      >
        {todo.label}
      </Button>
    </Card.Root>
  );
}
