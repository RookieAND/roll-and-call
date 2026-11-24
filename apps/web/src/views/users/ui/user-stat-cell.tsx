import { Card, HStack, cn, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

import { ServerLink } from "@/shared/ui";

const SIZE = {
  md: {
    padding: "sm",
    gap: "125",
    circle: "size-8",
    icon: 16,
    value: "subtitle1",
    label: "body4",
    tight: false,
  },
  sm: {
    padding: "none",
    gap: "100",
    circle: "size-7",
    icon: 14,
    value: "subtitle2",
    label: "body5",
    tight: true,
  },
} as const;

interface UserStatCellProps {
  icon: LucideIcon;
  value: number;
  label: string;
  path: string;
  tinted?: boolean;
  // 모바일 카드는 같은 모양을 한 단계 작게 쓴다.
  size?: keyof typeof SIZE;
}

// 칸마다 그 유저의 세션 목록으로 가는 링크다. 아이콘은 원형 바탕에 넣어 두 줄 글자 옆에 붙여 둔다. 모집 중·참여 예정이 있으면 칸은 연한 틴트, 아이콘 원은 진한 primary로 바꿔 눈에 띄게 한다.
export function UserStatCell({
  icon: Icon,
  value,
  label,
  path,
  tinted = false,
  size = "md",
}: UserStatCellProps) {
  const scale = SIZE[size];
  const foreground = tinted ? "primary" : "normal";
  return (
    <Card.Root
      background="subtle"
      padding={scale.padding}
      radius={400}
      interactive
      render={<HStack align="center" gap={scale.gap} render={<ServerLink path={path} />} />}
      className={cn(
        "hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-tinted-ink",
        size === "sm" && "px-100 py-075",
        tinted && "border-tinted-border bg-tinted-bg hover:bg-tinted-bg-hover",
      )}
    >
      <span
        className={cn(
          "flex flex-none items-center justify-center rounded-full",
          scale.circle,
          tinted ? "bg-primary-600 text-on-primary" : "bg-surface text-gray-600",
        )}
      >
        <Icon size={scale.icon} aria-hidden />
      </span>
      <VStack gap={scale.tight ? "050" : "025"} className="min-w-0">
        <Text
          typography={scale.value}
          weight="bold"
          numeric
          tight={scale.tight}
          foreground={foreground}
        >
          {value}
        </Text>
        <Text
          truncate
          tight={scale.tight}
          typography={scale.label}
          foreground={tinted ? "primary" : "muted"}
        >
          {label}
        </Text>
      </VStack>
    </Card.Root>
  );
}
