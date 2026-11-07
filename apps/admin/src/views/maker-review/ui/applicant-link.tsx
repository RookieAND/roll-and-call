import { Avatar, HStack, Text } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface ApplicantLinkProps {
  userId: string;
  nickname: string;
  avatarUrl: string | null;
}

export function ApplicantLink({ userId, nickname, avatarUrl }: ApplicantLinkProps) {
  return (
    <HStack align="center" gap="100" className="min-w-0">
      <Avatar src={avatarUrl} name={nickname} size="sm" />
      <Text
        typography="body3"
        weight="bold"
        foreground="primary"
        truncate
        render={<ServerLink path={`/users/${userId}`} />}
      >
        {nickname}
      </Text>
    </HStack>
  );
}
