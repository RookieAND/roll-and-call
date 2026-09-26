import { Button, Callout } from "@roll-and-call/ui";
import Link from "next/link";

interface NextRoundBannerProps {
  gameId: string;
  waitingCount: number;
}

export function NextRoundBanner({ gameId, waitingCount }: NextRoundBannerProps) {
  return (
    <Callout.Root colorPalette="primary" variant="outline">
      <Callout.Title>대기 {waitingCount}명으로 다음 회차 열기</Callout.Title>
      <Callout.Description>
        같은 게임을 새 구인글로 한 번 더 엽니다.
        <br />
        대기 순번대로 정원까지 직접 확정으로 채워 둡니다.
      </Callout.Description>
      <div className="col-span-full mt-150">
        <Button render={<Link href={`/games/new?from=${gameId}`} />} className="w-full">
          다음 회차 만들기
        </Button>
      </div>
    </Callout.Root>
  );
}
