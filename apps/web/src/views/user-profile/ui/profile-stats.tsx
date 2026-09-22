import { Grid, Text, VStack } from "@roll-and-call/ui";

interface ProfileStatsProps {
  hosted: number;
  played: number;
}

// 이 숫자는 어느 자리에 많이 앉았는지만 말한다. 어떤 사람인지는 성향이 말한다.
export function ProfileStats({ hosted, played }: ProfileStatsProps) {
  const stats = [
    { label: "운영한 세션", count: hosted },
    { label: "참여한 세션", count: played },
  ];

  return (
    <Grid cols={2} className="border-t border-gray-200">
      {stats.map((stat) => {
        const countForeground = stat.count === 0 ? "hint" : "normal";
        return (
          <VStack
            key={stat.label}
            align="center"
            gap="050"
            className="border-gray-200 py-175 not-first:border-l"
          >
            <Text
              numeric
              weight="extrabold"
              typography="heading2"
              foreground={countForeground}
              className="tracking-[-0.02em]"
            >
              {stat.count}
            </Text>
            <Text typography="body4" foreground="hint">
              {stat.label}
            </Text>
          </VStack>
        );
      })}
    </Grid>
  );
}
