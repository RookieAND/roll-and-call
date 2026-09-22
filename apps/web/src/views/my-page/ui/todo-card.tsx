import { Button, Card, HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { CircleAlert, Clock, SquareCheck, UserCheck, UserPlus, Users } from "lucide-react";
import Link from "next/link";

import { SESSION_ACTION_KIND } from "@/widgets/session-list";

import type { TodoItem } from "../model/session-todos";

const EYEBROW: Record<string, { label: string; icon: typeof Clock }> = {
  [SESSION_ACTION_KIND.drawLottery]: { label: "추첨 대기", icon: Users },
  [SESSION_ACTION_KIND.confirmTime]: { label: "세션 일시 미정", icon: CircleAlert },
  [SESSION_ACTION_KIND.reviewApplicants]: { label: "신청 승인 대기", icon: UserCheck },
  [SESSION_ACTION_KIND.fillVacancy]: { label: "빈자리 생김", icon: UserPlus },
  [SESSION_ACTION_KIND.confirmAttendance]: { label: "출석 미확인", icon: SquareCheck },
  [SESSION_ACTION_KIND.submitAvailability]: { label: "가능 시간 미제출", icon: Clock },
};

// 지금 막혀 있는 일은 카드 전체를 붉게 칠하고 초록 버튼을, 여유가 있는 일은 기본 카드에 보라 버튼을 단다.
const todoCard = cva("p-175", {
  variants: { blocked: { true: "border-danger-200 bg-danger-50", false: "" } },
});

interface TodoCardProps {
  item: TodoItem;
}

export function TodoCard({ item: { title, todo } }: TodoCardProps) {
  const { label, icon: Icon } = EYEBROW[todo.kind]!;

  return (
    <Card padding="none" className={todoCard({ blocked: todo.blocked })}>
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
        className="mt-050 leading-relaxed whitespace-pre-line"
      >
        {todo.description}
      </Text>
      <Button asChild variant={todo.blocked ? "confirm" : "tinted"} className="mt-150 h-11 w-full">
        <Link href={todo.href}>{todo.label}</Link>
      </Button>
    </Card>
  );
}
