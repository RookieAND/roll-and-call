import { Callout } from "@roll-and-call/ui";

export function NameConflictCallout() {
  return (
    <Callout.Root colorPalette="danger">
      <Callout.Icon />
      <Callout.Title>같은 이름의 룰이 이미 있습니다.</Callout.Title>
      <Callout.Description>승인할 수 없습니다. 반려해 주세요.</Callout.Description>
    </Callout.Root>
  );
}
