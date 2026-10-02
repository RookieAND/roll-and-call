import { Button, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { JoinHint } from "./join-hint";

interface NonMemberActionsProps {
  joinPath: string;
}

export function NonMemberActions({ joinPath }: NonMemberActionsProps) {
  return (
    <VStack gap="125">
      <JoinHint>이 서버에 가입하면 신청할 수 있어요.</JoinHint>
      <Button render={<Link href={joinPath} />} size="lg" className="w-full">
        가입하기
      </Button>
    </VStack>
  );
}
