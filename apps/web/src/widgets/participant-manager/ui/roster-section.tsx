import { cn, HStack, Text, VStack } from "@trpg/ui";
import type { ReactNode } from "react";

// 로스터 목록 한 묶음의 껍데기: 좌측 제목 · 우측 안내 · 테두리 박스.
export function RosterSection({
  title,
  hint,
  boxClassName,
  children,
}: {
  title: string;
  hint: string;
  boxClassName?: string;
  children: ReactNode;
}) {
  return (
    <VStack gap={2}>
      <HStack justify="between" align="center">
        <Text typography="body3" foreground="muted" className="font-bold">
          {title}
        </Text>
        <Text typography="body3" foreground="muted">
          {hint}
        </Text>
      </HStack>
      <div className={cn("overflow-hidden rounded-xl border border-gray-200", boxClassName)}>
        {children}
      </div>
    </VStack>
  );
}
