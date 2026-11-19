import { Button, Card, Progress, Text, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface NextScheduleCardProps {
  gameId: string;
  roundNo: number;
  // 가능 시간을 모으는 중이면 응답 현황, 아니면 null.
  response: { respondedCount: number; totalCount: number } | null;
}

// 조율형에서 일정을 잡을 다음 회차. 줄 안 버튼 대신 이 카드가 일정 잡기 입구다.
export function NextScheduleCard({ gameId, roundNo, response }: NextScheduleCardProps) {
  const path = `/games/${gameId}/rounds/${roundNo}/schedule`;
  return (
    <Card.Root padding="md" radius={600}>
      <VStack gap="100">
        <Text typography="subtitle2" render={<h3 />}>
          다음 일정
        </Text>
        <VStack gap="025">
          <Text typography="body2" weight="bold">
            {roundNo}회차 · {response ? "가능 시간을 모으고 있습니다" : "아직 정하지 않았습니다"}
          </Text>
          {response && (
            <Text typography="body4" foreground="muted" className="tabular-nums">
              응답 {response.respondedCount} / {response.totalCount}명
            </Text>
          )}
        </VStack>
        {response && (
          <Progress value={response.respondedCount} max={response.totalCount} aria-label="응답" />
        )}
        <Button
          size="lg"
          variant={response ? "outline" : "solid"}
          className="w-full"
          render={<ServerLink path={path} />}
        >
          {response ? `${roundNo}회차 현황 보기` : `${roundNo}회차 일정 잡기`}
        </Button>
      </VStack>
    </Card.Root>
  );
}
