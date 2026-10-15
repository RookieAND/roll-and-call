import { HStack } from "@roll-and-call/ui";

import { Tag } from "../tag";

interface StatusBadgesProps {
  // 「확정 · GM」처럼 ` · `로 이은 상태 문구. 값마다 뱃지 하나다.
  status: string;
}

// 색은 데스크톱과 같은 STATUS_TONE 표를 따르고, 표에 없는 「대기…」는 주의 색이다.
export function StatusBadges({ status }: StatusBadgesProps) {
  return (
    <HStack gap="050" className="shrink-0">
      {status.split(" · ").map((part) => (
        <Tag key={part} tone={part.startsWith("대기") ? "warning" : "gray"}>
          {part}
        </Tag>
      ))}
    </HStack>
  );
}
