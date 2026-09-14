import { Progress, Text, VStack } from "@trpg/ui";

export const Colors = () => (
  <VStack gap={3} className="w-64">
    <VStack gap={1}>
      <Text typography="body4" foreground="muted">
        모집 중 · 3 / 5명
      </Text>
      <Progress value={3} max={5} color="recruiting" />
    </VStack>
    <VStack gap={1}>
      <Text typography="body4" foreground="muted">
        정원 충족 · 5 / 5명
      </Text>
      <Progress value={5} max={5} color="confirmed" />
    </VStack>
    <VStack gap={1}>
      <Text typography="body4" foreground="muted">
        마감 · 2 / 5명
      </Text>
      <Progress value={2} max={5} color="closed" />
    </VStack>
  </VStack>
);
