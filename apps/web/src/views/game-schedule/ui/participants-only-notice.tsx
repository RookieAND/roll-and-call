import { Callout, VStack } from "@roll-and-call/ui";

import { LoginButton } from "@/features/auth";

interface ParticipantsOnlyNoticeProps {
  isSignedIn: boolean;
}

export function ParticipantsOnlyNotice({ isSignedIn }: ParticipantsOnlyNoticeProps) {
  return (
    <VStack gap="150">
      <Callout.Root colorPalette="gray" size="sm">
        <Callout.Icon />
        <div>
          <Callout.Title>참여자만 가능 시간을 낼 수 있습니다</Callout.Title>
          <Callout.Description>겹침은 누구나 볼 수 있습니다.</Callout.Description>
        </div>
      </Callout.Root>
      {!isSignedIn && <LoginButton className="w-full" />}
    </VStack>
  );
}
