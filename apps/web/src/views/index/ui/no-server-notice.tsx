import { Button, Callout, VStack } from "@roll-and-call/ui";
import { Link2 } from "lucide-react";

import { INQUIRY_URL } from "../model/inquiry-url";

export function NoServerNotice() {
  return (
    <VStack gap="125">
      <Callout.Root>
        <Callout.Icon className="text-tinted-ink">
          <Link2 size={16} strokeWidth={2.2} />
        </Callout.Icon>
        <Callout.Title>아직 가입한 서버가 없습니다</Callout.Title>
        <Callout.Description className="break-keep">
          서버 운영진이 공유한 가입 링크로 들어와 주세요.
        </Callout.Description>
      </Callout.Root>
      <Button
        size="lg"
        render={<a href={INQUIRY_URL} target="_blank" rel="noreferrer" />}
        className="w-full"
      >
        도입 문의하기
      </Button>
    </VStack>
  );
}
