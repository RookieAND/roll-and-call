import { Badge, Card, Container, Grid, HStack, Text, VStack } from "@roll-and-call/ui";

export const GameListSection = () => (
  <Container className="border border-dashed border-gray-300 bg-gray-50 py-200">
    <VStack gap="150">
      <Text typography="heading3" weight="bold">
        모집 중인 세션
      </Text>
      <Grid cols={2} gap="150">
        <Card.Root padding="sm">
          <VStack gap="025">
            <Text typography="subtitle2" weight="bold">
              크툴루의 부름 단편
            </Text>
            <Text typography="body4" foreground="muted">
              GM 달빛 · 정원 4/6
            </Text>
          </VStack>
        </Card.Root>
        <Card.Root padding="sm">
          <VStack gap="025">
            <Text typography="subtitle2" weight="bold">
              디아스포라 3화
            </Text>
            <Text typography="body4" foreground="muted">
              GM 새벽 · 정원 2/5
            </Text>
          </VStack>
        </Card.Root>
      </Grid>
    </VStack>
  </Container>
);

export const ApplySummaryContainer = () => (
  <Container size="sm" className="border border-dashed border-gray-300 bg-gray-50 py-200">
    <Card.Root>
      <VStack gap="075">
        <Text typography="subtitle1" weight="bold">
          신청 내용 확인
        </Text>
        <Text typography="body3" foreground="muted">
          크툴루의 부름 단편 · 토요일 오후 2시
        </Text>
        <Badge colorPalette="success">신청 완료</Badge>
      </VStack>
    </Card.Root>
  </Container>
);

export const FullWidthDashboard = () => (
  <Container size="full" className="border border-dashed border-gray-300 bg-gray-50 py-200">
    <HStack gap="150" justify="between">
      <Card.Root padding="sm" className="flex-1">
        <VStack gap="025">
          <Text typography="body4" foreground="hint">
            이번 달 확정 세션
          </Text>
          <Text typography="heading3" weight="extrabold">
            12개
          </Text>
        </VStack>
      </Card.Root>
      <Card.Root padding="sm" className="flex-1">
        <VStack gap="025">
          <Text typography="body4" foreground="hint">
            대기 중인 신청
          </Text>
          <Text typography="heading3" weight="extrabold">
            5명
          </Text>
        </VStack>
      </Card.Root>
    </HStack>
  </Container>
);
