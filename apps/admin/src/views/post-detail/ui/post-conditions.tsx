import { Card, HStack, Text } from "@roll-and-call/ui";

import { Tag } from "@/shared/ui";

interface PostConditionsProps {
  lines: string[];
}

export function PostConditions({ lines }: PostConditionsProps) {
  return (
    <Card.Root
      padding="none"
      render={<HStack align="center" gap="150" />}
      className="shrink-0 flex-wrap px-200 py-125"
    >
      <Text typography="body4" foreground="muted" className="w-22 flex-none">
        참여 조건
      </Text>
      {lines.length === 0 ? (
        <Text typography="body4" foreground="hint">
          제한 없음
        </Text>
      ) : (
        <>
          {lines.map((line) => (
            <Tag key={line}>{line}</Tag>
          ))}
          {lines.length > 1 && (
            <Text typography="body4" foreground="hint">
              두 조건을 모두 충족해야 신청할 수 있습니다
            </Text>
          )}
        </>
      )}
    </Card.Root>
  );
}
