import { Callout } from "@roll-and-call/ui";

import type { ReopenContext } from "../model/reopen-context";

export function ReopenNotice({ reopen }: { reopen: ReopenContext }) {
  if (reopen.failed) {
    return (
      <Callout.Root colorPalette="danger">
        <Callout.Icon />
        <Callout.Title>불러오지 못했습니다.</Callout.Title>
        <Callout.Description>내용을 직접 입력해 주세요.</Callout.Description>
      </Callout.Root>
    );
  }
  return (
    <Callout.Root colorPalette="primary">
      <Callout.Icon />
      <Callout.Title>{reopen.title} 구인의 내용을 불러왔습니다.</Callout.Title>
      <Callout.Description>
        세션 일시, 조율 기간, 모집 마감은 비워 두었습니다.
        <br />
        5단계에서 새로 정해 주세요.
      </Callout.Description>
    </Callout.Root>
  );
}
