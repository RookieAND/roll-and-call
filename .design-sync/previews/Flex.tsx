import { Badge, Button, Chip, Flex, Text } from "@roll-and-call/ui";

export const SessionToolbar = () => (
  <Flex justify="between" align="center" gap="150">
    <Text typography="subtitle1" weight="bold">
      크툴루의 부름 단편
    </Text>
    <Flex gap="100" align="center">
      <Badge colorPalette="primary">모집 중</Badge>
      <Button size="sm">신청하기</Button>
    </Flex>
  </Flex>
);

export const SystemFilterWrap = () => (
  <Flex wrap align="center" gap="075" className="max-w-64">
    <Chip selected>크툴루의 부름</Chip>
    <Chip>디아스포라</Chip>
    <Chip>던전 앤 드래곤</Chip>
    <Chip>인세인</Chip>
    <Chip>코리a스텔라</Chip>
  </Flex>
);

export const InlineMetaFlex = () => (
  <Flex inline align="center" gap="075">
    <Text typography="body4" foreground="muted">
      GM 달빛
    </Text>
    <Text typography="body4" foreground="hint">
      ·
    </Text>
    <Text typography="body4" foreground="muted">
      정원 4/6
    </Text>
    <Text typography="body4" foreground="hint">
      ·
    </Text>
    <Text typography="body4" foreground="success">
      확정
    </Text>
  </Flex>
);
