import { Text } from "@roll-and-call/ui";

import type { PostDetail } from "@/entities/post/server";

import { receivedActionValue } from "../model/received-action-value";

interface GmValueProps {
  gm: PostDetail["gm"];
}

// 요약의 GM 값: 닉네임과 받은 조치 hint
export function GmValue({ gm }: GmValueProps) {
  return (
    <>
      {gm.nickname}
      <Text typography="body3" foreground="hint" render={<span />}>
        {receivedActionValue(gm.receivedActionCount)}
      </Text>
    </>
  );
}
