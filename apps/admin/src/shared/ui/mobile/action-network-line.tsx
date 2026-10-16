import { Text } from "@roll-and-call/ui";

// 고정 바 위의 오류는 Callout 대신 빨간 한 줄이다. 확정 버튼 라벨이 [다시 시도]로 바뀐다.
export function ActionNetworkLine() {
  return (
    <Text typography="body4" weight="bold" foreground="danger" className="text-center">
      네트워크 오류로 처리하지 못했습니다
    </Text>
  );
}
