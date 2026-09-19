import { Text } from "@trpg/ui";

// 이 숫자는 어느 자리에 많이 앉았는지만 말한다. 어떤 사람인지는 성향이 말한다.
export function ProfileStats({ hosted, played }: { hosted: number; played: number }) {
  const stats = [
    { label: "운영한 세션", count: hosted },
    { label: "참여한 세션", count: played },
  ];

  return (
    <div className="grid grid-cols-2 border-t border-gray-200">
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
