import { Avatar, HStack, Text, type TextProps } from "@trpg/ui";

export function GameGmLabel({
  name,
  avatarUrl,
  showRole = true,
  typography = "body4",
  foreground = "muted",
}: {
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
  showRole?: boolean;
  typography?: TextProps["typography"];
  foreground?: TextProps["foreground"];
}) {
  const label = showRole ? `GM ${name ?? "?"}` : (name ?? "?");
  return (
    <HStack gap={2} align="center">
      <Avatar src={avatarUrl} name={name} size="sm" />
      <Text typography={typography} foreground={foreground}>
        {label}
      </Text>
    </HStack>
  );
}
