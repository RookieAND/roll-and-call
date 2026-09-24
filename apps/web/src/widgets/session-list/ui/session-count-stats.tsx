import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface SessionCount {
  count: number;
  href: string;
}

interface SessionCountStatsProps {
  hosted: SessionCount;
  played: SessionCount;
}

// 07 마이페이지와 08 타인 프로필이 같이 쓴다. 숫자는 어느 자리에 많이 앉았는지만 말하고, 누르면 그 역할의 세션 기록으로 간다.
export function SessionCountStats({ hosted, played }: SessionCountStatsProps) {
  const stats = [
    { label: "운영한 세션", ...hosted },
    { label: "참여한 세션", ...played },
  ];

  return (
    <Grid cols={2} className="-mx-200 border-y border-gray-200">
      {stats.map((stat) => {
        const countForeground = stat.count === 0 ? "hint" : "normal";
        return (
          <VStack
            key={stat.label}
            align="center"
            gap="050"
            render={<Link href={stat.href} />}
            className="border-gray-200 py-175 transition-colors not-first:border-l hover:bg-gray-50"
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
            <HStack align="center" gap="025" className="text-hint">
              <Text typography="body4" foreground="hint">
                {stat.label}
              </Text>
              <ChevronRight size={12} strokeWidth={2.2} aria-hidden />
            </HStack>
          </VStack>
        );
      })}
    </Grid>
  );
}
