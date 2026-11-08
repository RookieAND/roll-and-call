import { Badge, HStack, Text } from "@roll-and-call/ui";

interface AttendanceHeaderProps {
  title: string;
  attendeeCount: number;
  attendanceConfirmed: boolean;
}

export function AttendanceHeader({
  title,
  attendeeCount,
  attendanceConfirmed,
}: AttendanceHeaderProps) {
  const countLabel = attendanceConfirmed ? "확정됨" : `참여 ${attendeeCount}명`;

  return (
    <HStack gap="100" align="center">
      <Text
        truncate
        typography="heading3"
        weight="extrabold"
        render={<h2 />}
        className="min-w-0 flex-1"
      >
        {title}
      </Text>
      <Badge colorPalette={attendanceConfirmed ? "success" : "gray"} className="flex-none">
        {countLabel}
      </Badge>
    </HStack>
  );
}
