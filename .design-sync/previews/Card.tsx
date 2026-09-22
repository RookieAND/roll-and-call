import { Avatar, Badge, Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Clock, Users } from "lucide-react";

export const RecruitCard = () => (
  <Card.Root>
    <Card.Header>
      <VStack gap="050">
        <Text typography="subtitle1" weight="bold">크툴루의 부름 단편</Text>
        <Text typography="body4" foreground="muted">GM 달빛 · 초심자 환영</Text>
      </VStack>
      <Badge colorPalette="primary">모집 중</Badge>
    </Card.Header>
    <Card.Body>
      <HStack gap="150" className="mt-100">
        <HStack gap="050" align="center">
          <Users size={14} className="text-gray-500" />
          <Text typography="body4" foreground="muted">정원 4/6</Text>
        </HStack>
        <HStack gap="050" align="center">
          <Clock size={14} className="text-gray-500" />
          <Text typography="body4" foreground="muted">토요일 오후 2시</Text>
        </HStack>
      </HStack>
    </Card.Body>
    <Card.Footer>
      <Button colorPalette="primary">신청하기</Button>
      <Button variant="outline">자세히 보기</Button>
    </Card.Footer>
  </Card.Root>
);

export const SessionSummaryCard = () => (
  <Card.Root background="subtle" radius={500} padding="lg">
    <VStack gap="075">
      <Text typography="body4" foreground="hint">다음 세션</Text>
      <Text typography="heading3" weight="extrabold">디아스포라 3화 — 궤도 위의 그림자</Text>
      <Text typography="body3" foreground="muted">확정 · 9월 27일 토요일 오후 7시</Text>
    </VStack>
  </Card.Root>
);

export const InteractiveApplicantCard = () => (
  <VStack gap="100">
    <Card.Root interactive padding="sm">
      <HStack align="center" justify="between">
        <HStack align="center" gap="100">
          <Avatar name="새벽" size="sm" />
          <Text typography="body3" weight="medium">새벽</Text>
        </HStack>
        <Badge colorPalette="success">확정</Badge>
      </HStack>
    </Card.Root>
    <Card.Root interactive padding="sm">
      <HStack align="center" justify="between">
        <HStack align="center" gap="100">
          <Avatar name="파도" size="sm" />
          <Text typography="body3" weight="medium">파도</Text>
        </HStack>
        <Badge>대기</Badge>
      </HStack>
    </Card.Root>
  </VStack>
);
