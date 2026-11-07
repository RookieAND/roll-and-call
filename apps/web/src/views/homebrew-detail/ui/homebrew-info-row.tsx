import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface HomebrewInfoRowProps {
  label: string;
  children: ReactNode;
  action?: ReactNode;
  // 값이 길면(한 줄 소개) 라벨과 버튼을 윗줄로 올려 값이 카드 전체 폭을 쓴다.
  stacked?: boolean;
}

export function HomebrewInfoRow({
  label,
  children,
  action,
  stacked = false,
}: HomebrewInfoRowProps) {
  const labelText = (
    <Text typography="body4" foreground="hint" className="w-[74px] flex-none">
      {label}
    </Text>
  );
  if (stacked) {
    return (
      <VStack gap="050" className="min-h-12 px-200 py-125">
        <HStack align="center" justify="between" gap="150">
          {labelText}
          {/* 44px 터치 영역은 그대로 두고, 글자 끝을 카드 안쪽 여백에 맞추며 윗줄 높이를 늘리지 않는다. */}
          {action && <div className="-my-125 -mr-200">{action}</div>}
        </HStack>
        {children}
      </VStack>
    );
  }
  return (
    <HStack align="center" gap="150" className="min-h-12 px-200 py-125">
      {labelText}
      <HStack align="center" className="min-w-0 flex-1">
        {children}
      </HStack>
      {action}
    </HStack>
  );
}
