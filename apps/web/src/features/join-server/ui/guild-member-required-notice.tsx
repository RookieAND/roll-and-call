import { Callout } from "@roll-and-call/ui";

export function GuildMemberRequiredNotice() {
  return (
    <Callout.Root colorPalette="warning">
      <Callout.Icon />
      <Callout.Title>이 디스코드 서버의 멤버만 가입할 수 있어요</Callout.Title>
      <Callout.Description>
        디스코드 서버에 먼저 참여한 뒤 다시 확인해 주세요. 확인 결과는 최대 5분쯤 늦게 바뀔 수
        있어요.
      </Callout.Description>
    </Callout.Root>
  );
}
