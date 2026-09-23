import { Badge, HStack, Text } from "@roll-and-call/ui";

interface AttendanceHeaderProps {
  title: string;
  rule: string;
  confirmedCount: number;
  attendanceConfirmed: boolean;
}

export function AttendanceHeader({
  title,
  rule,
  confirmedCount,
  attendanceConfirmed,
}: AttendanceHeaderProps) {
  const countLabel = attendanceConfirmed ? "확정됨" : `확정 ${confirmedCount}명`;

  return (
    <HStack gap="100" align="center">
      <Text
        truncate
        typography="heading3"
        weight="extrabold"
        render={<h1 />}
        className="min-w-0 flex-1"
      >
        {title}
      </Text>
      <Badge colorPalette="gray" className="flex-none">
        {rule}
      </Badge>
      <Badge colorPalette={attendanceConfirmed ? "success" : "gray"} className="flex-none">
        {countLabel}
      </Badge>
    </HStack>
  );
}
