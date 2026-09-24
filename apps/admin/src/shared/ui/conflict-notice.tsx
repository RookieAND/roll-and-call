import { HStack, Text, VStack } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface ConflictNoticeProps {
  title: string;
  description: string;
  actions: ReactNode;
}

// 다른 운영진이 먼저 처리했을 때 심사·제재·불참 취소에 같은 모양으로 붙인다.
export function ConflictNotice({ title, description, actions }: ConflictNoticeProps) {
  return (
    <HStack
      role="alert"
      align="center"
      gap="150"
      className="rounded-600 border border-(--rc-color-fg-notice) bg-notice-bg px-175 py-150"
    >
      <TriangleAlert size={18} aria-hidden className="shrink-0 text-notice-ink" />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="subtitle2">{title}</Text>
        <Text typography="body4" foreground="muted">
          {description}
        </Text>
      </VStack>
      <HStack gap="075">{actions}</HStack>
    </HStack>
  );
}
