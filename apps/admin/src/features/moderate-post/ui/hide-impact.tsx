import { Grid, Text, VStack } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";

interface HideImpactProps {
  memberCount: number;
  waitingCount: number;
  startsAt: Date;
}

// 숨김은 목록과 검색에서만 빠진다는 점을 확정 전에 보여 준다.
export function HideImpact({ memberCount, waitingCount, startsAt }: HideImpactProps) {
  const items = [
    { label: "목록 · 검색", value: "빠짐", sub: "새로 보는 사람에게만" },
    { label: `참여자 ${memberCount}명 · 대기 ${waitingCount}명`, value: "그대로 접근" },
    { label: `${formatDate(startsAt)} 세션`, value: "그대로 진행" },
  ];
  return (
    <Grid
      render={<dl />}
      className="grid-cols-3 overflow-hidden rounded-400 border border-gray-200"
    >
      {items.map((item) => (
        <VStack
          key={item.label}
          gap="025"
          className="min-w-0 border-l border-gray-200 px-175 py-125 first:border-l-0"
        >
          <Text typography="body4" foreground="hint" truncate render={<dt />}>
            {item.label}
          </Text>
          <Text typography="subtitle1" render={<dd />}>
            {item.value}
          </Text>
          {item.sub ? (
            <Text typography="body4" foreground="hint">
              {item.sub}
            </Text>
          ) : null}
        </VStack>
      ))}
    </Grid>
  );
}
