import { Button, HStack, VStack } from "@roll-and-call/ui";

export const VariantByColor = () => (
  <VStack gap="100">
    <HStack gap="100">
      <Button variant="solid" colorPalette="primary">구인 등록</Button>
      <Button variant="outline" colorPalette="primary">임시 저장</Button>
      <Button variant="tinted" colorPalette="primary">초대 링크 복사</Button>
      <Button variant="ghost" colorPalette="primary">취소</Button>
    </HStack>
    <HStack gap="100">
      <Button variant="solid" colorPalette="success">참여 확정</Button>
      <Button variant="solid" colorPalette="danger">모집 마감</Button>
      <Button variant="solid" colorPalette="discord">디스코드 연동</Button>
    </HStack>
  </VStack>
);

export const Sizes = () => (
  <HStack gap="100" className="items-center">
    <Button size="sm">앱바 액션</Button>
    <Button size="md">참여 신청</Button>
    <Button size="lg">추첨 시작</Button>
  </HStack>
);

export const States = () => (
  <HStack gap="100">
    <Button loading>참여 신청</Button>
    <Button disabled>마감</Button>
    <Button variant="outline" disabled>대기 접수 중</Button>
  </HStack>
);
