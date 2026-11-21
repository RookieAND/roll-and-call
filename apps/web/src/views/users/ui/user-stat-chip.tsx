import { Card, cn, Text } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface UserStatChipProps {
  icon: LucideIcon;
  value: number;
  label: string;
  tinted?: boolean;
}

// 모바일 카드의 4칸 수치 한 칸. 이름은 화면에 쓰지 않고 읽기용 이름으로만 둔다. 모집 중이 있으면 칸을 틴트로 바꾼다.
export function UserStatChip({ icon: Icon, value, label, tinted = false }: UserStatChipProps) {
  return (
    <Card.Root
      background="subtle"
      padding="none"
      radius={400}
      role="img"
      aria-label={`${label} ${value}`}
      className={cn(
        "flex h-10 items-center justify-center gap-075",
        tinted ? "border-tinted-border bg-tinted-bg text-tinted-ink" : "text-gray-600",
      )}
    >
      <Icon size={16} aria-hidden />
      <Text typography="subtitle2" weight="bold" numeric foreground="inherit">
        {value}
      </Text>
    </Card.Root>
  );
}
