import { Badge, HStack, Text, VStack } from "@trpg/ui";

import { formatDateTime } from "@/shared/lib";

export function AttendanceHeader({
  title,
  rule,
  confirmedAt,
  confirmedCount,
  attendanceConfirmedAt,
}: {
  title: string;
  rule: string;
  confirmedAt: Date;
  confirmedCount: number;
  attendanceConfirmedAt: Date | null;
}) {
  return (
    <VStack gap="150">
      <VStack gap="100">
        <HStack gap="100" align="center">
          <Text truncate typography="heading1" className="min-w-0 flex-1">
            {title}
          </Text>
          <Badge color="gray">
            {attendanceConfirmedAt ? "확정됨" : `확정 ${confirmedCount}명`}
          </Badge>
        </HStack>
        <Text typography="body4" foreground="muted" render={<p />} className="tabular-nums">
          {formatDateTime(confirmedAt)} · {rule}
        </Text>
      </VStack>
      {attendanceConfirmedAt ? (
        <div className="rounded-500 border border-gray-200 px-175 py-150">
          <Text typography="body4" foreground="muted" render={<p />} className="leading-relaxed">
            {formatDateTime(attendanceConfirmedAt)}에 확정했습니다.
            <br />
            잘못 정했다면 아래에서 다시 여세요.
          </Text>
        </div>
      ) : (
        <Text typography="body4" foreground="muted" render={<p />} className="leading-relaxed">
          오지 않은 사람만 <b>불참</b>으로 바꾸세요.
          <br />
          나머지는 그대로 두면 참석으로 기록됩니다.
        </Text>
      )}
    </VStack>
  );
}
