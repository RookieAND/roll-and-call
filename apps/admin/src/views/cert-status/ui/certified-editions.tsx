import { Badge, HStack, Text } from "@roll-and-call/ui";

const LIST_LIMIT = 2;

interface CertifiedEditionsProps {
  editions: string[];
}

// 판본은 두 개까지만 적고 나머지는 "외 n개"로 줄여 행 높이를 지킨다.
export function CertifiedEditions({ editions }: CertifiedEditionsProps) {
  if (editions.length === 0) {
    return (
      <Text typography="body3" foreground="hint">
        없음
      </Text>
    );
  }
  const rest = editions.length - LIST_LIMIT;
  return (
    <HStack align="center" gap="075" className="min-w-0">
      <Text typography="body3" truncate>
        {editions.slice(0, LIST_LIMIT).join(", ")}
      </Text>
      {rest > 0 ? <Badge className="shrink-0">외 {rest}개</Badge> : null}
    </HStack>
  );
}
