import { Card, Text, VStack } from "@roll-and-call/ui";

import { ProfileBlockLabel } from "./profile-block-label";

interface ProfilePlayStyleProps {
  playStyle: string;
}

export function ProfilePlayStyle({ playStyle }: ProfilePlayStyleProps) {
  return (
    <VStack render={<section />}>
      <ProfileBlockLabel label="플레이 스타일" />
      <Card.Root background="subtle" padding="md" radius={600}>
        <Text typography="body2" render={<p />} className="text-pretty whitespace-pre-line">
          {playStyle}
        </Text>
      </Card.Root>
    </VStack>
  );
}
