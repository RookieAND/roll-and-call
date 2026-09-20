import { HStack, Text } from "@trpg/ui";

export function AttendanceTally({
  presentCount,
  absentCount,
}: {
  presentCount: number;
  absentCount: number;
}) {
  return (
    <HStack gap={2} align="center" className="px-0.5">
      <Text typography="subtitle1" foreground="muted">
        참석 {presentCount}명
      </Text>
      <Text typography="body3" foreground="hint">
        ·
      </Text>
      <Text typography="subtitle1" foreground={absentCount > 0 ? "danger" : "muted"}>
        불참 {absentCount}명
      </Text>
    </HStack>
  );
}
