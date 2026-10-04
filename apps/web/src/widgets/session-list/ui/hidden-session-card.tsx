import { Card, Text } from "@roll-and-call/ui";

// 보는 사람이 볼 수 없는 숨긴 구인(R4). 제목 자리만 남기고 누를 수 없다.
export function HiddenSessionCard() {
  return (
    <Card.Root padding="sm" radius={600} background="none" className="bg-surface">
      <Text typography="heading3" foreground="muted" render={<p />} className="p-025">
        운영진이 숨긴 구인입니다.
      </Text>
    </Card.Root>
  );
}
