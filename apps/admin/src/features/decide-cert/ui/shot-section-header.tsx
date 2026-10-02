import { HStack, Text } from "@roll-and-call/ui";

import { Tag } from "@/shared/ui";

interface ShotSectionHeaderProps {
  title: string;
  checkedCount: number;
  total: number;
}

export function ShotSectionHeader({ title, checkedCount, total }: ShotSectionHeaderProps) {
  return (
    <HStack align="center" gap="100">
      <Text typography="heading3" render={<h2 id="shot-section-title" />}>
        {title}
      </Text>
      <HStack className="ml-auto shrink-0">
        <Tag tone={checkedCount === total ? "success" : "gray"}>
          {`확인 ${checkedCount} / ${total}`}
        </Tag>
      </HStack>
    </HStack>
  );
}
