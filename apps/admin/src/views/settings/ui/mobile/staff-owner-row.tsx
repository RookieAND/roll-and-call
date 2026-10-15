import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface StaffOwnerRowProps {
  title: ReactNode;
  trailing: ReactNode;
  description: ReactNode;
  meta?: ReactNode;
}

// ponytail: 소유자 줄은 해제할 수 없어 들어갈 곳이 없다. ListRow는 줄 전체가 링크라 같은 모양을 링크 없이 둔다. ListRow의 path가 선택이 되면 지운다.
export function StaffOwnerRow({ title, trailing, description, meta }: StaffOwnerRowProps) {
  return (
    <VStack
      gap="050"
      className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-175"
    >
      <HStack align="center" gap="075" className="min-h-6 min-w-0">
        <Text typography="body2" weight="bold" truncate className="min-w-0 shrink">
          {title}
        </Text>
        <HStack align="center" className="ml-auto shrink-0">
          {trailing}
        </HStack>
      </HStack>
      <Text typography="body3" foreground="muted" truncate className="leading-5">
        {description}
      </Text>
      {meta ? (
        <Text typography="body4" foreground="hint" truncate className="leading-[18px]">
          {meta}
        </Text>
      ) : null}
    </VStack>
  );
}
