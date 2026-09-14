import { Chip, HStack } from "@trpg/ui";

export const Pills = () => (
  <HStack gap={2} wrap>
    <Chip selected>전체</Chip>
    <Chip>모집 중</Chip>
    <Chip>세션 확정</Chip>
    <Chip>마감</Chip>
  </HStack>
);

export const Blocks = () => (
  <HStack gap={2}>
    <Chip shape="block" selected>
      일시 고정
    </Chip>
    <Chip shape="block">일정 조율</Chip>
  </HStack>
);

export const Disabled = () => (
  <HStack gap={2}>
    <Chip disabled>평일 저녁</Chip>
    <Chip selected disabled>
      주말 오후
    </Chip>
  </HStack>
);
