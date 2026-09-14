import { Avatar, HStack } from "@trpg/ui";

export const Initials = () => (
  <HStack gap={2} align="center">
    <Avatar name="김루키" />
    <Avatar name="이다온" />
    <Avatar name="박서준" />
    <Avatar name="최하늘" />
    <Avatar name="정유나" />
    <Avatar />
  </HStack>
);

export const Sizes = () => (
  <HStack gap={3} align="end">
    <Avatar name="김루키" size="sm" />
    <Avatar name="김루키" size="md" />
    <Avatar name="김루키" size="stack" />
    <Avatar name="김루키" size="lg" />
    <Avatar name="김루키" size="xl" />
    <Avatar name="김루키" size="2xl" />
    <Avatar name="김루키" size="3xl" />
  </HStack>
);
