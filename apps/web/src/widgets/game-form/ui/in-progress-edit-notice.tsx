import { Callout } from "@roll-and-call/ui";

export function InProgressEditNotice() {
  return (
    <Callout.Root colorPalette="warning" size="sm">
      <Callout.Icon />
      <Callout.Description>
        진행 중인 구인은 주의 사항, 시놉시스, 이미지만 고칠 수 있습니다.
      </Callout.Description>
    </Callout.Root>
  );
}
