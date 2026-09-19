import { VStack } from "@trpg/ui";

import { LoginButton } from "@/features/auth";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";

export function AnonActions({ isFull, isLottery }: { isFull: boolean; isLottery: boolean }) {
  const anonMessage =
    isFull && !isLottery
      ? "정원이 찼지만 대기 신청은 가능합니다. 로그인 후 신청하세요."
      : "참여하려면 로그인이 필요합니다.";

  return (
    <VStack gap={2}>
      <ActionHint>{anonMessage}</ActionHint>
      <LoginButton className={ACTION_PRIMARY_CLASS} />
    </VStack>
  );
}
