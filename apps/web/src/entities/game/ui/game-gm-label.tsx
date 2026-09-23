import { Avatar, HStack, Text } from "@roll-and-call/ui";

interface GameGmLabelProps {
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
}

export function GameGmLabel({ name, avatarUrl }: GameGmLabelProps) {
  return (
    <HStack gap="100" align="center" className="min-w-0 flex-1">
      <Avatar src={avatarUrl} name={name} size="sm" />
      <HStack align="baseline" gap="075" className="min-w-0">
        <Text typography="body4" weight="bold" foreground="hint" className="shrink-0">
          GM
        </Text>
        <Text truncate typography="subtitle2">
          {name ?? "?"}
        </Text>
      </HStack>
    </HStack>
  );
}
