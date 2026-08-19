import { Avatar, HStack, Text, type TextProps } from "@trpg/ui";

// GM 아바타 + 이름 라벨. 이름이 없으면 "?"로 대체.
// showRole: "GM " 접두 표기(카드 기본). 좌측 키가 이미 "GM"인 표에선 false.
// typography/foreground: 이름 텍스트 타이포를 호출부가 소유(미지정 시 카드용 body2·muted).
export function GameGmLabel({
  name,
  avatarUrl,
  showRole = true,
  typography = "body2",
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
