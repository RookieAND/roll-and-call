import { Avatar, HStack, Text } from "@roll-and-call/ui";

export const SizeSweep = () => (
  <HStack gap="150" align="center">
    <Avatar name="이서연" size="sm" />
    <Avatar name="이서연" size="md" />
    <Avatar name="이서연" size="lg" />
    <Avatar name="이서연" size="xl" />
    <Avatar name="이서연" size="2xl" />
  </HStack>
);

export const GmLabel = () => (
  <HStack gap="100" align="center" className="min-w-0">
    <Avatar name="박준영" size="sm" />
    <Text typography="body4" foreground="muted">
      GM 박준영
    </Text>
  </HStack>
);

export const ParticipantRoster = () => (
  <HStack gap="075" align="center">
    <Avatar name="김민준" size="stack" />
    <Avatar name="이서연" size="stack" />
    <Avatar name="박도윤" size="stack" />
    <Avatar name="최지우" size="stack" />
  </HStack>
);
