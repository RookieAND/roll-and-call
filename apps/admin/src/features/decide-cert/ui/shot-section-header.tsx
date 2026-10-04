import { HStack, Text } from "@roll-and-call/ui";

import { Tag } from "@/shared/ui";

interface ShotSectionHeaderProps {
  title: string;
  checkedCount: number;
  total: number;
  deleted: boolean;
}

export function ShotSectionHeader({ title, checkedCount, total, deleted }: ShotSectionHeaderProps) {
  const done = checkedCount === total;
  return (
    <HStack align="center" gap="100">
      <Text typography="heading3" render={<h2 id="shot-section-title" />}>
        {title}
      </Text>
      <HStack className="ml-auto shrink-0">
        {deleted ? (
          <Tag>사진 삭제됨</Tag>
        ) : (
          <Tag tone={done ? "success" : "gray"}>{`확인 ${checkedCount} / ${total}`}</Tag>
        )}
      </HStack>
    </HStack>
  );
}
