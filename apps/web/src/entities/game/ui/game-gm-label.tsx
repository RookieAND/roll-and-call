import { Avatar, HStack, Text } from "@trpg/ui";

// GM 아바타 + 이름 라벨. 이름이 없으면 "?"로 대체.
export function GameGmLabel({
  name,
  avatarUrl,
}: {
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
}) {
  return (
    <HStack gap={2} align="center">
      <Avatar src={avatarUrl} name={name} size="sm" />
      <Text size="sm" color="muted">
        GM {name ?? "?"}
      </Text>
    </HStack>
  );
}
