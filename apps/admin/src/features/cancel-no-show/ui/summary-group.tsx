import { Text, VStack } from "@roll-and-call/ui";

import { FactRows, type FactRow } from "@/shared/ui";

interface SummaryGroupProps {
  title: string;
  items: FactRow[];
}

// 불참 기록 요약의 한 묶음. 모바일 상세와 같은 묶음 이름을 쓴다.
export function SummaryGroup({ title, items }: SummaryGroupProps) {
  return (
    <VStack gap="050" render={<section />} className="py-125 first:pt-100">
      <Text typography="body4" weight="bold" foreground="muted" render={<h3 />}>
        {title}
      </Text>
      <FactRows wide items={items} />
    </VStack>
  );
}
