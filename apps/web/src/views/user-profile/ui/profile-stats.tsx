import { Text } from "@trpg/ui";

export function ProfileStats({
  hosted,
  upcoming,
  past,
}: {
  hosted: number;
  upcoming: number;
  past: number;
}) {
  const stats = [
    { label: "진행한 세션", count: hosted },
    { label: "참여 예정", count: upcoming },
    { label: "마감된 세션", count: past },
  ];

  return (
    <div className="grid grid-cols-3 border-t border-gray-200">
      {stats.map((stat) => {
        const countForeground = stat.count === 0 ? "hint" : "normal";
        return (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 border-gray-200 py-3.5 not-first:border-l"
          >
            <Text
              typography="heading2"
              foreground={countForeground}
              className="text-[19px] font-extrabold tracking-[-0.02em] tabular-nums"
            >
              {stat.count}
            </Text>
            <Text typography="body4" foreground="hint">
              {stat.label}
            </Text>
          </div>
        );
      })}
    </div>
  );
}
