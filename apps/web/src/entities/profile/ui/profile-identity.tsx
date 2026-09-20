import { Avatar, HStack, Text } from "@trpg/ui";

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
    <HStack gap="150" align="center">
      <Avatar src={avatarUrl} name={name} size="2xl" />
      <div>
        <Text typography="heading2" className="block leading-tight">
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
