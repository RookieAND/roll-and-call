import { Button, Callout } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface SplitTeamsBannerProps {
  gameId: string;
  candidateCount: number;
  // 추첨·선발 판정 전이면 대기 자리에 신청자가 선다.
  beforeResult: boolean;
}

export function SplitTeamsBanner({ gameId, candidateCount, beforeResult }: SplitTeamsBannerProps) {
  const countLabel = `${beforeResult ? "신청" : "대기"} ${candidateCount}명`;

  return (
    <Callout.Root colorPalette="primary" variant="outline">
      <Callout.Icon />
      <Callout.Title>{countLabel}으로 팀 나누기</Callout.Title>
      <Callout.Description>
        대기자를 새 구인으로 나누어 따로 진행할 수 있습니다.
        <div className="mt-150">
          <Button
            render={<ServerLink path={`/games/${gameId}/teams`} />}
            size="lg"
            className="w-full"
          >
            팀 나누기
          </Button>
        </div>
      </Callout.Description>
    </Callout.Root>
  );
}
