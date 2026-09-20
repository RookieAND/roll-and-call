"use client";

import { Text } from "@trpg/ui";

export function GamePreflightNotice() {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      이 단계의 항목은 언제든 바꿀 수 있습니다.
      <br />
      트리거와 AI 이미지만 참여자에게 알립니다.
    </Text>
  );
}
