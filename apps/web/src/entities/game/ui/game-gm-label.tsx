import { Avatar, HStack, Text, type TextProps } from "@trpg/ui";

export function GameGmLabel({
  name,
  avatarUrl,
  showRole = true,
  typography = "body4",
  foreground = "muted",
  weight,
}: {
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
  showRole?: boolean;
  typography?: TextProps["typography"];
  foreground?: TextProps["foreground"];
  weight?: TextProps["weight"];
}) {
  const label = showRole ? `GM ${name ?? "?"}` : (name ?? "?");
  return (
    <HStack gap="100" align="center" className="min-w-0">
      <Avatar src={avatarUrl} name={name} size="sm" />
      <Text truncate typography={typography} foreground={foreground} weight={weight}>
        {label}
      </Text>
    </HStack>
  );
}
