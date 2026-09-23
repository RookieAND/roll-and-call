import { Chip, HStack } from "@roll-and-call/ui";

export const ToneSweep = () => (
  <HStack gap="075" className="flex-wrap">
    <Chip tone="interactive">전체</Chip>
    <Chip tone="neutral">모집 중</Chip>
    <Chip tone="outline">대기 접수 중</Chip>
    <Chip tone="notice">마감 임박</Chip>
  </HStack>
);

export const SelectedState = () => (
  <HStack gap="075">
    <Chip selected>참여 확정</Chip>
    <Chip>추첨 대기</Chip>
    <Chip selected>디스코드</Chip>
  </HStack>
);

export const BlockShape = () => (
  <HStack gap="075" className="w-80">
    <Chip shape="block" selected>
      참석
    </Chip>
    <Chip shape="block">불참</Chip>
  </HStack>
);

export const Disabled = () => (
  <HStack gap="075">
    <Chip disabled>마감</Chip>
    <Chip selected disabled>
      추첨 완료
    </Chip>
  </HStack>
);
