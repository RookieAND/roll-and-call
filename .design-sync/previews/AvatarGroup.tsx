import { AvatarGroup, VStack } from "@trpg/ui";

const party = [
  { name: "김루키" },
  { name: "이다온" },
  { name: "박서준" },
  { name: "최하늘" },
  { name: "정유나" },
];

export const Party = () => <AvatarGroup people={party} size="stack" />;

export const Overflow = () => (
  <VStack gap={3}>
    <AvatarGroup people={party.slice(0, 2)} size="md" />
    <AvatarGroup people={party} max={4} size="md" />
    <AvatarGroup people={party} max={2} size="lg" />
  </VStack>
);
