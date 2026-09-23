import { Button, Callout } from "@roll-and-call/ui";
import Link from "next/link";

interface DrawPendingCardProps {
  gameId: string;
}

export function DrawPendingCard({ gameId }: DrawPendingCardProps) {
  return (
    <Callout.Root colorPalette="primary">
      <Callout.Title className="text-subtitle1">추첨 결과를 확정해 주세요</Callout.Title>
      <Callout.Description>
        신청자마다 1d100을 굴려 두었습니다.
        <br />
        확정하기 전까지는 명단도 그대로이고 알림도 나가지 않습니다.
      </Callout.Description>
      <div className="col-span-full mt-150">
        <Button render={<Link href={`/games/${gameId}/draw`} />} size="lg" className="w-full">
          추첨 결과 보기
        </Button>
      </div>
    </Callout.Root>
  );
}
