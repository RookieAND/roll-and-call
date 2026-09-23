import { Button, Callout } from "@roll-and-call/ui";
import Link from "next/link";

interface AttendanceBannerProps {
  gameId: string;
  confirmedCount: number;
}

export function AttendanceBanner({ gameId, confirmedCount }: AttendanceBannerProps) {
  return (
    <Callout.Root colorPalette="primary">
      <Callout.Title>출석 확인이 남아 있습니다</Callout.Title>
      <Callout.Description>
        확정 참여자 {confirmedCount}명이 왔는지 정해 주세요.
        <br />
        확인을 마쳐야 이 세션이 완료로 기록됩니다.
      </Callout.Description>
      <div className="col-span-full mt-150">
        <Button render={<Link href={`/games/${gameId}/attendance`} />} size="lg" className="w-full">
          출석 확인하기
        </Button>
      </div>
    </Callout.Root>
  );
}
