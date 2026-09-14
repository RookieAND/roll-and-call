import { Button, HStack, VStack } from "@trpg/ui";

export const Variants = () => (
  <HStack gap={2} wrap>
    <Button variant="solid">참여하기</Button>
    <Button variant="outline">참여 취소</Button>
    <Button variant="tinted">일정 조율하기</Button>
    <Button variant="confirm">이 시간으로 확정</Button>
    <Button variant="ghost">닫기</Button>
    <Button variant="danger">구인 삭제</Button>
  </HStack>
);

export const Discord = () => (
  <Button variant="discord" size="lg" className="w-full">
    Discord로 로그인
  </Button>
);

export const Sizes = () => (
  <HStack gap={2} align="center">
    <Button size="sm">새 구인</Button>
    <Button size="md">새 구인</Button>
    <Button size="lg">새 구인</Button>
  </HStack>
);

export const States = () => (
  <VStack gap={2}>
    <Button size="lg" className="w-full" loading>
      저장 중…
    </Button>
    <Button size="lg" className="w-full" disabled>
      모집이 마감되었습니다
    </Button>
  </VStack>
);
