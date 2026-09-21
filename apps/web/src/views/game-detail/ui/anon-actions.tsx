import { VStack } from "@trpg/ui";

import { LoginButton } from "@/features/auth";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";

export function AnonActions() {
  return (
    <VStack gap="125">
      <ActionHint>참여하려면 로그인이 필요합니다.</ActionHint>
      <LoginButton className={ACTION_PRIMARY_CLASS} />
    </VStack>
  );
}
