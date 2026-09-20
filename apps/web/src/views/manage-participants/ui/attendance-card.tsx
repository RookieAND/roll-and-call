import { Badge, Button, Card, HStack, Text, VStack } from "@trpg/ui";
import { Clock } from "lucide-react";
import Link from "next/link";

import { formatDateTime } from "@/shared/lib";

// 세션이 끝나면 명단 관리 대신 이 한 가지만 남는다.
export function AttendanceCard({ gameId, confirmedAt }: { gameId: string; confirmedAt: Date }) {
  return (
    <Card padding="none" className="rounded-500 px-3.5 py-3">
      <VStack gap={3}>
        <HStack align="center" gap={2}>
          <Clock size={15} strokeWidth={2.2} aria-hidden className="shrink-0 text-gray-600" />
          <Text typography="body4" foreground="muted" className="min-w-0 flex-1">
            세션
          </Text>
          <Text numeric typography="subtitle2" className="shrink-0">
            {formatDateTime(confirmedAt)}
          </Text>
          <Badge color="gray" className="shrink-0">
            끝남
          </Badge>
        </HStack>
        <Text typography="body4" foreground="muted" render={<p />} className="leading-relaxed">
          출석을 확정해야 이 세션이 완료로 기록됩니다.
          <br />
          확정 전까지는 참여자의 기록에 들어가지 않습니다.
        </Text>
        <Button asChild variant="tinted" className="h-[46px] w-full rounded-500">
          <Link href={`/games/${gameId}/attendance`}>출석 확인하기</Link>
        </Button>
      </VStack>
    </Card>
  );
}
