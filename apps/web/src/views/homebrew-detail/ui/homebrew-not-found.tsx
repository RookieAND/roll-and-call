import { Button, Text, UiImage, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

export function HomebrewNotFound() {
  return (
    <VStack align="center" gap="200" className="px-200 pt-500 pb-300 text-center">
      <UiImage name="empty-rulebook" width={140} height={140} />
      <Text typography="heading3" render={<h2 />}>
        찾을 수 없는 내가 만든 룰입니다
      </Text>
      <Button variant="outline" size="lg" render={<ServerLink path="/me/rulebooks" />}>
        내 룰북으로
      </Button>
    </VStack>
  );
}
