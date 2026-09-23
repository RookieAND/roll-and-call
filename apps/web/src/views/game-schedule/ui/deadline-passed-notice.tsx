import { Callout } from "@roll-and-call/ui";

export function DeadlinePassedNotice() {
  return (
    <Callout.Root colorPalette="gray" size="sm">
      <Callout.Icon />
      <div>
        <Callout.Title>모집 기한이 지났습니다</Callout.Title>
        <Callout.Description>
          {"GM이 세션 시간을 확정하는 중입니다.\n가능 시간은 지금도 고칠 수 있습니다."}
        </Callout.Description>
      </div>
    </Callout.Root>
  );
}
