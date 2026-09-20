import { Text } from "@trpg/ui";

export function ConfirmSummary({
  playLabel,
  respondedCount,
}: {
  playLabel: string;
  respondedCount: number;
}) {
  const items = [
    { label: "플레이타임", value: playLabel },
    { label: "가능 시간 제출", value: `${respondedCount}명` },
  ];

  return (
    <div>
      <div className="flex gap-100">
        {items.map((item) => (
          <div key={item.label} className="flex-1 rounded-500 border border-gray-200 px-175 py-150">
            <Text typography="body4" foreground="hint" render={<p />}>
              {item.label}
            </Text>
            <Text typography="subtitle1" render={<p />} className="mt-025">
              {item.value}
            </Text>
          </div>
        ))}
      </div>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-100">
        시작 시각부터 {playLabel}이 끊기지 않고 비는 시간만 셉니다.
      </Text>
    </div>
  );
}
