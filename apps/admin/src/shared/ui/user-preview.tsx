import { HStack, Text, VStack } from "@roll-and-call/ui";
import { Eye } from "lucide-react";
import type { ReactNode } from "react";

interface UserPreviewProps {
  title?: string;
  children: ReactNode;
}

// 사용자에게 보일 문구를 확정 전에 그대로 보여 주는 상자.
export function UserPreview({ title = "사용자에게 이렇게 보입니다", children }: UserPreviewProps) {
  return (
    <VStack gap="100" className="rounded-600 border border-tinted-border bg-tinted-bg p-150">
      <HStack align="center" gap="075" className="text-tinted-ink">
        <Eye size={14} aria-hidden />
        <Text typography="body4" weight="bold" foreground="primary">
          {title}
        </Text>
      </HStack>
      <Text
        typography="body3"
        render={<div />}
        className="rounded-400 border border-gray-200 bg-surface p-150"
      >
        {children}
      </Text>
    </VStack>
  );
}
