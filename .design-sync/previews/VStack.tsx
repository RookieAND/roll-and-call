import { Avatar, Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

export const ApplicantList = () => (
  <VStack gap="150">
    <HStack justify="between" align="center">
      <HStack gap="100" align="center">
        <Avatar name="달빛" size="sm" />
        <Text typography="body3" weight="medium">달빛</Text>
      </HStack>
      <Badge colorPalette="success">확정</Badge>
    </HStack>
    <HStack justify="between" align="center">
      <HStack gap="100" align="center">
        <Avatar name="새벽" size="sm" />
        <Text typography="body3" weight="medium">새벽</Text>
      </HStack>
      <Badge>대기</Badge>
    </HStack>
    <HStack justify="between" align="center">
      <HStack gap="100" align="center">
        <Avatar name="파도" size="sm" />
        <Text typography="body3" weight="medium">파도</Text>
      </HStack>
      <Badge>대기</Badge>
    </HStack>
  </VStack>
);

export const RecruitCardStack = () => (
  <VStack gap="200">
    <Card.Root padding="sm">
      <VStack gap="025">
        <Text typography="subtitle2" weight="bold">크툴루의 부름 단편</Text>
        <Text typography="body4" foreground="muted">GM 달빛 · 정원 4/6</Text>
      </VStack>
    </Card.Root>
    <Card.Root padding="sm">
      <VStack gap="025">
        <Text typography="subtitle2" weight="bold">디아스포라 3화</Text>
        <Text typography="body4" foreground="muted">GM 새벽 · 정원 2/5</Text>
      </VStack>
    </Card.Root>
  </VStack>
);

export const FormSummaryStack = () => (
  <VStack gap="100" align="stretch">
    <VStack gap="025">
      <Text typography="body4" foreground="hint">세션</Text>
      <Text typography="body3" weight="medium">크툴루의 부름 단편</Text>
    </VStack>
    <VStack gap="025">
      <Text typography="body4" foreground="hint">일정</Text>
      <Text typography="body3" weight="medium">토요일 오후 2시</Text>
    </VStack>
    <VStack gap="025">
      <Text typography="body4" foreground="hint">상태</Text>
      <Badge colorPalette="success">신청 완료</Badge>
    </VStack>
  </VStack>
);
