import { Card, Text, VStack } from "@roll-and-call/ui";

import { ReopenGameLink } from "@/features/reopen-game";

interface ManageReopenSectionProps {
  gameId: string;
}

export function ManageReopenSection({ gameId }: ManageReopenSectionProps) {
  return (
    <Card.Root padding="md" radius={600}>
      <VStack gap="075">
        <Text typography="subtitle1">해당 구인글을 다시 열고 싶으신가요?</Text>
        <Text typography="body3" foreground="muted" className="text-pretty">
          지난 구인의 제목과 소개, 모집 조건을 불러와 새 구인을 만듭니다. 지금 구인은 그대로
          남습니다.
        </Text>
      </VStack>
      <div className="mt-200">
        <ReopenGameLink gameId={gameId} variant="solid" />
      </div>
    </Card.Root>
  );
}
