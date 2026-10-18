import { Button, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import { ActionNotice } from "./action-notice";

interface ConditionsUnmetActionsProps {
  lines: string[];
  certUnmet: boolean;
}

export function ConditionsUnmetActions({ lines, certUnmet }: ConditionsUnmetActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice title="신청 조건을 채우지 못했습니다" lines={lines} colorPalette="danger" />
      {certUnmet && (
        <Button
          render={<ServerLink path="/me/rulebooks/apply" />}
          variant="outline"
          size="lg"
          className="w-full"
        >
          룰북 인증하기
        </Button>
      )}
    </VStack>
  );
}
