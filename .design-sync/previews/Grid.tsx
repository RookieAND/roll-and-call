import { Avatar, Badge, Card, Grid, Text, VStack } from "@roll-and-call/ui";

export const SummaryGrid = () => (
  <Grid cols={2} gap="100">
    <Card.Root padding="sm" background="subtle">
      <VStack gap="025">
        <Text typography="body4" foreground="hint">
          신청
        </Text>
        <Text typography="heading3" weight="extrabold">
          8명
        </Text>
      </VStack>
    </Card.Root>
    <Card.Root padding="sm" background="subtle">
      <VStack gap="025">
        <Text typography="body4" foreground="hint">
          확정
        </Text>
        <Text typography="heading3" weight="extrabold">
          6명
        </Text>
      </VStack>
    </Card.Root>
  </Grid>
);

export const RosterGrid = () => (
  <Grid cols={3} gap="150">
    <VStack gap="050" align="center">
      <Avatar name="달빛" size="md" />
      <Text typography="body4">달빛</Text>
      <Badge colorPalette="success">확정</Badge>
    </VStack>
    <VStack gap="050" align="center">
      <Avatar name="새벽" size="md" />
      <Text typography="body4">새벽</Text>
      <Badge>대기</Badge>
    </VStack>
    <VStack gap="050" align="center">
      <Avatar name="파도" size="md" />
      <Text typography="body4">파도</Text>
      <Badge>대기</Badge>
    </VStack>
  </Grid>
);

export const ScheduleGrid = () => (
  <Grid cols={4} gap="075">
    <Card.Root padding="sm" radius={400}>
      <VStack gap="025">
        <Text typography="body4" weight="bold">
          금 20:00
        </Text>
        <Text typography="body5" foreground="muted">
          3명 가능
        </Text>
      </VStack>
    </Card.Root>
    <Card.Root padding="sm" radius={400} background="subtle">
      <VStack gap="025">
        <Text typography="body4" weight="bold">
          토 14:00
        </Text>
        <Text typography="body5" foreground="muted">
          4명 가능
        </Text>
      </VStack>
    </Card.Root>
    <Card.Root padding="sm" radius={400}>
      <VStack gap="025">
        <Text typography="body4" weight="bold">
          토 19:00
        </Text>
        <Text typography="body5" foreground="muted">
          2명 가능
        </Text>
      </VStack>
    </Card.Root>
    <Card.Root padding="sm" radius={400} background="subtle">
      <VStack gap="025">
        <Text typography="body4" weight="bold">
          일 18:00
        </Text>
        <Text typography="body5" foreground="muted">
          5명 가능
        </Text>
      </VStack>
    </Card.Root>
  </Grid>
);
