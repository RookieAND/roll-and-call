import { Card, HStack, cn, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

const SIZE = {
  md: { padding: "sm", gap: "125", circle: "size-8", icon: 16, value: "subtitle1", label: "body4" },
  sm: {
    padding: "none",
    gap: "100",
    circle: "size-7",
    icon: 14,
    value: "subtitle2",
    label: "body5",
  },
} as const;

interface UserStatCellProps {
  icon: LucideIcon;
  value: number;
  label: string;
  tinted?: boolean;
  // 모바일 카드는 같은 모양을 한 단계 작게 쓴다.
  size?: keyof typeof SIZE;
}

// 아이콘은 원형 바탕에 넣어 두 줄 글자 옆에 붙여 둔다. 모집 중이 있으면 칸 전체를 틴트로 바꾼다.
export function UserStatCell({
  icon: Icon,
  value,
  label,
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
      render={<HStack align="center" gap={scale.gap} />}
      className={cn(
        size === "sm" && "px-100 py-075",
        tinted && "border-tinted-border bg-tinted-bg",
      )}
    >
      <span
        className={cn(
          "flex flex-none items-center justify-center rounded-full bg-surface",
          scale.circle,
          tinted ? "text-tinted-ink" : "text-gray-600",
        )}
      >
        <Icon size={scale.icon} aria-hidden />
      </span>
      <VStack gap="025" className="min-w-0">
        <Text typography={scale.value} weight="bold" numeric foreground={foreground}>
          {value}
        </Text>
        <Text truncate typography={scale.label} foreground={tinted ? "primary" : "muted"}>
          {label}
        </Text>
      </VStack>
    </Card.Root>
  );
}
