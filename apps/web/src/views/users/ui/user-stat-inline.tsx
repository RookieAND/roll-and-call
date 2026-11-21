import { cn, HStack, Text } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface UserStatInlineProps {
  icon: LucideIcon;
  value: number;
  label: string;
  tinted?: boolean;
}

// 모바일 카드의 한 줄 수치. 이름은 화면에 쓰지 않고 읽기용 이름으로만 둔다.
export function UserStatInline({ icon: Icon, value, label, tinted = false }: UserStatInlineProps) {
  return (
    <HStack
      align="center"
      gap="050"
      role="img"
      aria-label={`${label} ${value}`}
      className={cn(tinted ? "text-tinted-ink" : "text-gray-600")}
    >
      <Icon size={14} aria-hidden />
      <Text typography="body4" weight="bold" numeric foreground="inherit">
        {value}
      </Text>
    </HStack>
  );
}
