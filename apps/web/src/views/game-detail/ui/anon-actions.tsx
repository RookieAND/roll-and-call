import { VStack } from "@trpg/ui";

import { LoginButton } from "@/features/auth";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";

interface AnonActionsProps {
  isLottery: boolean;
}

export function AnonActions({ isLottery }: AnonActionsProps) {
  const hint = isLottery
    ? "추첨에 참여하려면 로그인이 필요합니다."
    : "참여하려면 로그인이 필요합니다.";

  return (
    <VStack gap="125">
      <ActionHint>{hint}</ActionHint>
      <LoginButton className={ACTION_PRIMARY_CLASS} />
    </VStack>
  );
}
