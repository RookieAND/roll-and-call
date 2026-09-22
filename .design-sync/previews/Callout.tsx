import { Button, Callout, VStack } from "@roll-and-call/ui";

export const TintedPalette = () => (
  <VStack gap="100">
    <Callout.Root colorPalette="gray">
      <Callout.Description>정원이 다 찼습니다. 대기 신청은 계속 받습니다.</Callout.Description>
    </Callout.Root>
    <Callout.Root colorPalette="primary">
      <Callout.Description>확정 참여자 3명에게 디스코드로 같은 안내가 전해집니다.</Callout.Description>
    </Callout.Root>
    <Callout.Root colorPalette="success">
      <Callout.Description>출석을 확정했습니다. 30일 안에는 다시 고칠 수 있습니다.</Callout.Description>
    </Callout.Root>
    <Callout.Root colorPalette="warning">
      <Callout.Description>마감까지 3시간 남았습니다.</Callout.Description>
    </Callout.Root>
    <Callout.Root colorPalette="notice">
      <Callout.Description>확인 방식이 바뀌었습니다. GM이 직접 확정하는 절차가 추가됐습니다.</Callout.Description>
    </Callout.Root>
    <Callout.Root colorPalette="danger">
      <Callout.Description>신청자가 있어 정원을 줄일 수 없습니다.</Callout.Description>
    </Callout.Root>
  </VStack>
);

export const OutlinePalette = () => (
  <VStack gap="100">
    <Callout.Root variant="outline" colorPalette="primary">
      <Callout.Icon />
      <Callout.Title>추첨 대상</Callout.Title>
      <Callout.Description>신청 8명 중 4명을 뽑고 나머지는 대기로 남습니다.</Callout.Description>
    </Callout.Root>
    <Callout.Root variant="outline" colorPalette="success">
      <Callout.Icon />
      <Callout.Title>세션 확정</Callout.Title>
      <Callout.Description>참여자 전원에게 확정 안내가 디스코드로 전달됩니다.</Callout.Description>
    </Callout.Root>
    <Callout.Root variant="outline" colorPalette="danger">
      <Callout.Icon />
      <Callout.Title>구인 취소</Callout.Title>
      <Callout.Description>되돌릴 수 없습니다. 확정 참여자에게 취소가 전해집니다.</Callout.Description>
    </Callout.Root>
  </VStack>
);

export const DeadlineAction = () => (
  <Callout.Root colorPalette="warning">
    <Callout.Icon />
    <Callout.Title>마감 임박</Callout.Title>
    <Callout.Description>정원이 아직 안 찼습니다. 지금 추첨하면 모집이 바로 닫힙니다.</Callout.Description>
    <Callout.Action>
      <Button size="sm" colorPalette="warning">
        지금 추첨
      </Button>
    </Callout.Action>
  </Callout.Root>
);
