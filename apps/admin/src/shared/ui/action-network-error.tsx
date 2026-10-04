import { Callout } from "@roll-and-call/ui";

// 이 상태의 확정 버튼은 같은 색 solid [다시 시도](RotateCcw)로 라벨만 바뀌고 [취소]는 남는다.
export function ActionNetworkError() {
  return (
    <Callout.Root colorPalette="danger" size="sm">
      <Callout.Icon />
      <Callout.Description>
        네트워크 오류로 처리하지 못했습니다.
        <br />
        입력한 내용은 그대로 남아 있습니다.
      </Callout.Description>
    </Callout.Root>
  );
}
