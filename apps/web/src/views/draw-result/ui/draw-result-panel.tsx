import { Button, Text, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import { DrawSummary } from "./draw-summary";

interface DrawResultPanelProps {
  gameId: string;
  title: string;
  applicantCount: number;
  confirmedCount: number;
  drawnAt: Date;
}

export function DrawResultPanel({
  gameId,
  title,
  applicantCount,
  confirmedCount,
  drawnAt,
}: DrawResultPanelProps) {
  return (
    <>
      <VStack gap="100">
        <Text typography="subtitle2" foreground="muted" render={<h2 />}>
          추첨 요약
        </Text>
        <DrawSummary
          title={title}
          applicantCount={applicantCount}
          confirmedCount={confirmedCount}
          drawnAt={drawnAt}
        />
      </VStack>
      <Button
        render={<ServerLink path={`/games/${gameId}`} />}
        variant="outline"
        size="lg"
        className="w-full"
      >
        구인 글로 돌아가기
      </Button>
    </>
  );
}
