import { Card, HStack, cn, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface UserStatCellProps {
  icon: LucideIcon;
  value: number;
  label: string;
  tinted?: boolean;
}

// 아이콘은 원형 바탕에 넣어 두 줄 글자 옆에 붙여 둔다. 모집 중이 있으면 칸 전체를 틴트로 바꾼다.
export function UserStatCell({ icon: Icon, value, label, tinted = false }: UserStatCellProps) {
  const foreground = tinted ? "primary" : "normal";
  return (
    <Card.Root
      background="subtle"
      padding="sm"
      radius={400}
      render={<HStack align="center" gap="125" />}
      className={cn(tinted && "border-tinted-border bg-tinted-bg")}
    >
      <span
        className={cn(
          "flex size-8 flex-none items-center justify-center rounded-full bg-surface",
          tinted ? "text-tinted-ink" : "text-gray-600",
        )}
      >
        <Icon size={16} aria-hidden />
      </span>
      <VStack gap="025" className="min-w-0">
        <Text typography="subtitle1" weight="bold" numeric foreground={foreground}>
          {value}
        </Text>
        <Text truncate typography="body4" foreground={tinted ? "primary" : "muted"}>
          {label}
        </Text>
      </VStack>
    </Card.Root>
  );
}
