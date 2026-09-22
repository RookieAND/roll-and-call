import { Button, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";

export const JoinCta = () => (
  <FloatingBar.Root>
    <VStack gap="100" className="h-[320px] w-full px-200 pt-200">
      <Text typography="subtitle1" weight="bold">
        달빛 여관의 실종자
      </Text>
      <Text typography="body4" foreground="muted">
        정원 4명 중 3명 신청 · 마감 임박
      </Text>
    </VStack>
    <FloatingBar.Spacer />
    <FloatingBar.Content>
      <Button className="h-12 w-full rounded-500">참가 신청하기</Button>
    </FloatingBar.Content>
  </FloatingBar.Root>
);

export const RosterActions = () => (
  <FloatingBar.Root>
    <VStack gap="100" className="h-[320px] w-full px-200 pt-200">
      <Text typography="subtitle1" weight="bold">
        참여자 3명 선택됨
      </Text>
      <Text typography="body4" foreground="muted">
        GM이 명단을 확정하면 참여자에게 디스코드로 알립니다.
      </Text>
    </VStack>
    <FloatingBar.Spacer />
    <FloatingBar.Content>
      <HStack gap="100">
        <Button variant="outline" className="h-12 flex-1 rounded-500">
          취소
        </Button>
        <Button className="h-12 flex-1 rounded-500">명단 확정</Button>
      </HStack>
    </FloatingBar.Content>
  </FloatingBar.Root>
);
