import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface EntrySectionProps {
  title: string;
  right?: ReactNode;
  children: ReactNode;
}

// 조치 상세 카드 안의 한 구획. 구획 사이 선은 감싸는 카드가 긋는다.
export function EntrySection({ title, right, children }: EntrySectionProps) {
  return (
    <VStack gap="125" render={<section />} className="px-200 py-175">
      <HStack align="center" gap="100">
        <Text typography="heading3" render={<h3 />}>
          {title}
        </Text>
        {right ? <div className="ml-auto">{right}</div> : null}
      </HStack>
      {children}
    </VStack>
  );
}
