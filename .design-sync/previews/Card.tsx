import { Badge, Card, HStack, Progress, Text, VStack } from "@trpg/ui";

export const GameCard = () => (
  <Card interactive>
    <VStack gap={2}>
      <HStack justify="between" align="center">
        <Text typography="heading3">크툴루의 부름 — 안개 속의 저택</Text>
        <Badge color="primary">모집 중</Badge>
      </HStack>
      <Text typography="body3" foreground="muted">
        9월 20일 (토) 오후 8:00 · GM 김루키
      </Text>
      <Progress value={3} max={5} />
      <Text typography="body4" foreground="hint">
        3 / 5명 · 모집 마감 D-3
      </Text>
    </VStack>
  </Card>
);

export const Paddings = () => (
  <VStack gap={2}>
    <Card padding="sm">
      <Text typography="body3">padding="sm"</Text>
    </Card>
    <Card padding="md">
      <Text typography="body3">padding="md" (기본)</Text>
    </Card>
    <Card padding="lg">
      <Text typography="body3">padding="lg"</Text>
    </Card>
  </VStack>
);
