import { Text, VStack } from "@trpg/ui";

export const Section = () => (
  <VStack gap={1}>
    <Text typography="subtitle2" foreground="hint">
      세션 일시
    </Text>
    <Text typography="body2">9월 20일 (토) 오후 8:00</Text>
    <Text typography="body3" foreground="muted">
      플레이 시간 약 4시간
    </Text>
  </VStack>
);
