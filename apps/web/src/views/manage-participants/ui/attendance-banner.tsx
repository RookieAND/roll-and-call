import { Button, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

interface AttendanceBannerProps {
  gameId: string;
  confirmedCount: number;
}

export function AttendanceBanner({ gameId, confirmedCount }: AttendanceBannerProps) {
  return (
    <VStack gap="150" className="rounded-700 border border-tinted-border bg-tinted-bg p-200">
      <VStack gap="050">
        <Text typography="subtitle2">출석 확인이 남아 있습니다</Text>
        <Text typography="body4" foreground="muted" render={<p />}>
          확정 참여자 {confirmedCount}명이 왔는지 정해 주세요.
          <br />
          확인을 마쳐야 이 세션이 완료로 기록됩니다.
        </Text>
      </VStack>
      <Button
        render={<Link href={`/games/${gameId}/attendance`} />}
        className="h-[46px] w-full rounded-500"
      >
        출석 확인하기
      </Button>
    </VStack>
  );
}
