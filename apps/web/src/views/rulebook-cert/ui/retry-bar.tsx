import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { DiscardApplicationButton } from "@/features/certify-rulebook";

interface RetryBarProps {
  rulebookId: string;
  retryHref: string;
  discardable: boolean;
}

export function RetryBar({ rulebookId, retryHref, discardable }: RetryBarProps) {
  return (
    <VStack gap="100" className="border-t border-gray-200 px-200 pt-150 pb-200">
      {discardable && (
        <Text typography="body4" foreground="muted" className="text-center">
          기록을 지우면 이 신청 기록이 지워집니다.
        </Text>
      )}
      <HStack gap="100">
        {discardable && (
          <DiscardApplicationButton rulebookId={rulebookId} size="lg" className="min-w-0 flex-1" />
        )}
        <Button render={<Link href={retryHref} />} size="lg" className="min-w-0 flex-1">
          다시 신청
        </Button>
      </HStack>
    </VStack>
  );
}
