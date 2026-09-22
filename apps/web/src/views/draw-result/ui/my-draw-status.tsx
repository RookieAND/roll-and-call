import { Card, HStack, Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { Check, Clock } from "lucide-react";

const status = cva("rounded-600 px-200 py-150", {
  variants: {
    confirmed: { true: "border-tinted-border bg-tinted-bg", false: "bg-gray-50" },
  },
});

interface MyDrawStatusProps {
  confirmed: boolean;
  waitlistRank: number | null;
}

// 결과 자체가 주인공이다. 내 상태는 한 칸에 담고 바로 전체 결과로 넘어간다.
export function MyDrawStatus({ confirmed, waitlistRank }: MyDrawStatusProps) {
  const Icon = confirmed ? Check : Clock;
  const foreground = confirmed ? "primary" : "normal";
  const message = confirmed
    ? "축하합니다. 참여가 확정되었습니다!"
    : `아쉽지만 추첨 결과 대기 ${waitlistRank}번이에요`;

  return (
    <Card.Root padding="none" background="none" className={status({ confirmed })}>
      <HStack align="center" gap="100">
        <Text foreground={foreground} className="flex-none">
          <Icon aria-hidden size={15} strokeWidth={2.4} />
        </Text>
        <Text typography="body2" weight="bold" foreground={foreground} className="flex-1">
          {message}
        </Text>
      </HStack>
    </Card.Root>
  );
}
