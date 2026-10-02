import { Callout, HStack, Text, VStack } from "@roll-and-call/ui";
import { Link2 } from "lucide-react";

import { INQUIRY_URL } from "../model/inquiry-url";

export function NoServerNotice() {
  return (
    <VStack gap="150">
      <Callout.Root>
        <Callout.Icon className="text-tinted-ink">
          <Link2 size={16} strokeWidth={2.2} />
        </Callout.Icon>
        <Callout.Title>아직 롤앤콜을 쓰는 서버에 들어가 있지 않아요</Callout.Title>
        <Callout.Description className="break-keep">
          롤앤콜은 디스코드 서버마다 따로 운영돼요.
          <br />
          서버에 먼저 들어간 뒤, 운영진이 안내한 가입 링크로 와 주세요.
        </Callout.Description>
      </Callout.Root>
      <HStack wrap align="center" justify="center" className="gap-x-075 gap-y-050">
        <Text typography="body3" foreground="muted">
          서버를 운영하고 있다면
        </Text>
        <Text
          typography="body3"
          weight="bold"
          foreground="primary"
          render={<a href={INQUIRY_URL} target="_blank" rel="noreferrer" />}
        >
          도입 문의 →
        </Text>
      </HStack>
    </VStack>
  );
}
