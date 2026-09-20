import { Text } from "@trpg/ui";

export function SessionWindowSummary({
  windowLabel,
  memberCount,
}: {
  windowLabel: string;
  memberCount: number;
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-3.5 py-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <Text typography="body4" foreground="muted" render={<span />}>
          세션 시간
        </Text>
        <Text typography="subtitle2" render={<span />} className="tabular-nums">
          {windowLabel}
        </Text>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <Text typography="body4" foreground="muted" render={<span />}>
          가능 인원
        </Text>
        <Text typography="subtitle2" render={<span />} className="tabular-nums">
          {memberCount}명
        </Text>
      </div>
    </div>
  );
}
