import { AvatarGroup, HStack, Text } from "@roll-and-call/ui";

const ROSTER = [
  { name: "달빛" },
  { name: "은하수" },
  { name: "강물소리" },
  { name: "여름밤" },
  { name: "겨울잠" },
];

export const Participants = () => (
  <HStack align="center" gap="150">
    <AvatarGroup people={ROSTER} max={3} size="stack" />
    <Text typography="body4" foreground="muted">
      참여자 5명
    </Text>
  </HStack>
);

export const RecordLeaders = () => (
  <HStack align="center" gap="150">
    <AvatarGroup people={[{ name: "달빛" }, { name: "은하수" }]} size="lg" />
    <Text typography="subtitle1" weight="bold">
      공동 1위 · 12번
    </Text>
  </HStack>
);

export const SoloGm = () => (
  <HStack align="center" gap="150">
    <AvatarGroup people={[{ name: "강물소리" }]} size="md" />
    <Text typography="body4" foreground="muted">
      GM
    </Text>
  </HStack>
);
