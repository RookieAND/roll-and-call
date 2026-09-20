import { Button, Text, VStack } from "@trpg/ui";
import Link from "next/link";

export function AttendanceBanner({
  gameId,
  confirmedCount,
}: {
  gameId: string;
  confirmedCount: number;
}) {
  return (
    <VStack gap="150" className="rounded-700 border border-tinted-border bg-tinted-bg p-200">
      <VStack gap="050">
        <Text typography="subtitle2">출석 확인이 남아 있습니다</Text>
        <Text typography="body4" foreground="muted" render={<p />}>
          확정 참여자 {confirmedCount}명의 참석 여부를 정해 주세요.
          <br />
          출석을 확정해야 이 세션이 완료로 기록됩니다.
        </Text>
      </VStack>
      <Button asChild className="h-[46px] w-full rounded-500">
        <Link href={`/games/${gameId}/attendance`}>출석 확인하기</Link>
      </Button>
    </VStack>
  );
}
