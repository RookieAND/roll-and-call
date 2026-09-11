import { Avatar, HStack, Text } from "@trpg/ui";

// 순수 표시: 아바타 + 표시 이름(+ Discord 핸들). 링크·동작 없음(감싸는 쪽이 소유).
export function ProfileIdentity({
  name,
  avatarUrl,
  handle,
}: {
  name: string;
  avatarUrl: string | null;
  handle?: string | null;
}) {
  return (
    <HStack gap={3} align="center">
      <Avatar src={avatarUrl} name={name} size="2xl" />
      <div>
        <Text typography="heading1" className="block text-[19px] leading-tight">
          {name}
        </Text>
        {handle && (
          <Text typography="code2" foreground="hint" render={<span />}>
            @{handle}
          </Text>
        )}
      </div>
    </HStack>
  );
}
