import { Button, Card, Text, VStack } from "@trpg/ui";
import Link from "next/link";

interface DrawPendingCardProps {
  gameId: string;
}

export function DrawPendingCard({ gameId }: DrawPendingCardProps) {
  return (
    <Card padding="md" className="border-primary-600 bg-tinted-bg">
      <VStack gap="150">
        <VStack gap="050">
          <Text typography="subtitle1" weight="extrabold">
            추첨 결과를 확정해 주세요
          </Text>
          <Text typography="body4" foreground="muted" render={<p />}>
            신청자마다 1d100을 굴려 두었습니다.
            <br />
            확정하기 전까지는 명단도 그대로이고 알림도 나가지 않습니다.
          </Text>
        </VStack>
        <Button asChild className="h-[46px] w-full rounded-500">
          <Link href={`/games/${gameId}/draw`}>추첨 결과 보기</Link>
        </Button>
      </VStack>
    </Card>
  );
}
