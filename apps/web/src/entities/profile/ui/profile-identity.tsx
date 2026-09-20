import { Avatar, HStack, Text } from "@trpg/ui";

interface ProfileIdentityProps {
  name: string;
  avatarUrl: string | null;
  handle?: string | null;
}

export function ProfileIdentity({ name, avatarUrl, handle }: ProfileIdentityProps) {
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
