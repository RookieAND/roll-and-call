import { HStack, Text } from "@trpg/ui";

export function SessionWindowSummary({
  windowLabel,
  memberCount,
}: {
  windowLabel: string;
  memberCount: number;
}) {
  return (
    <div className="rounded-500 bg-gray-50 px-175 py-125">
      <HStack align="baseline" justify="between" gap="100">
        <Text typography="body4" foreground="muted" render={<span />}>
          세션 시간
        </Text>
        <Text typography="subtitle2" render={<span />} className="tabular-nums">
          {windowLabel}
        </Text>
      </HStack>
      <HStack align="baseline" justify="between" gap="100" className="mt-050">
        <Text typography="body4" foreground="muted" render={<span />}>
          가능 인원
        </Text>
        <Text typography="subtitle2" render={<span />} className="tabular-nums">
          {memberCount}명
        </Text>
      </HStack>
    </div>
  );
}
