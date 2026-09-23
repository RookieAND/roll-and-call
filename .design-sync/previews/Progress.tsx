import { Progress, VStack, Text } from "@roll-and-call/ui";

export const RecruitFill = () => (
  <VStack gap="075">
    <Text typography="body4" foreground="hint">
      GM 모집 (3 / 4)
    </Text>
    <Progress value={3} max={4} colorPalette="primary" />
  </VStack>
);

export const VariantSweep = () => (
  <VStack gap="150">
    <VStack gap="075">
      <Text typography="body4" foreground="hint">
        참여자 확정 (solid)
      </Text>
      <Progress value={6} max={6} variant="solid" colorPalette="success" />
    </VStack>
    <VStack gap="075">
      <Text typography="body4" foreground="hint">
        대기 접수 중 (tinted)
      </Text>
      <Progress value={2} max={6} variant="tinted" colorPalette="primary" />
    </VStack>
  </VStack>
);

export const Empty = () => (
  <VStack gap="075">
    <Text typography="body4" foreground="hint">
      모집 시작 전 (0 / 5)
    </Text>
    <Progress value={0} max={5} colorPalette="gray" />
  </VStack>
);
