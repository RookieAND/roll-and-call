import { Avatar, HStack, Text, VStack } from "@trpg/ui";

export const ProfileRow = () => (
  <HStack gap={3} align="center">
    <Avatar name="김루키" size="lg" />
    <VStack gap={0}>
      <Text typography="subtitle1">김루키</Text>
      <Text typography="body4" foreground="muted">
        GM · 연 세션 4개
      </Text>
    </VStack>
  </HStack>
);
