import { VStack } from "@roll-and-call/ui";

import { LoginButton } from "@/features/auth";

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
      <LoginButton className="w-full" />
    </VStack>
  );
}
